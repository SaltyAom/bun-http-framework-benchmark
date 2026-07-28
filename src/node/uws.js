/* Non-SSL is simply App() */
const uWS = require('uWebSockets.js')
const { createReadStream, statSync } = require('node:fs')
const { extraRoutes } = require('../extra-routes.mjs')

const app = uWS.App()
for (const route of extraRoutes) {
	app.get(route, (res) => res.end('ok'))
	app.post(`${route}/submit`, (res) => res.end('ok'))
}

app.get(
		'/',
		new uWS.DeclarativeResponse()
			.writeHeader('content-type', 'text/plain')
			.end('Hi')
	)
	.get(
		'/id/:id',
		new uWS.DeclarativeResponse()
			.writeHeader('content-type', 'text/plain')
			.writeHeader('x-powered-by', 'benchmark')
			.writeParameterValue('id')
			.write(' ')
			.writeQueryValue('name')
			.end()
	)
	.get('/video', (res) => {
		res.writeHeader('content-type', 'video/mp4')
		streamFile(res, 'public/kyuukurarin.mp4')
	})
	.post('/json', (res, req) => {
		readJson(
			res,
			(obj) => {
				res.writeHeader('content-type', 'application/json').end(
					JSON.stringify(obj)
				)
			},
			() => {
				res.end('Ok')
			}
		)
	})
	.listen(3000, (listenSocket) => {
		if (listenSocket) {
			console.log('Listening to port 3000')
		}
	})

function streamFile(res, path) {
	const stream = createReadStream(path)
	const size = statSync(path).size
	let chunk
	let chunkOffset = 0
	let aborted = false
	const tryEnd = (data) => {
		let result
		res.cork(() => {
			result = res.tryEnd(data, size)
		})
		return result
	}

	res.onAborted(() => {
		aborted = true
		stream.destroy()
	})
	res.onWritable((offset) => {
		const [ok, done] = tryEnd(chunk.subarray(offset - chunkOffset))
		if (done) stream.destroy()
		else if (ok) stream.resume()
		return ok
	})
	stream.on('data', (data) => {
		if (aborted) return
		chunk = data
		chunkOffset = res.getWriteOffset()
		const [ok, done] = tryEnd(chunk)
		if (done) stream.destroy()
		else if (!ok) stream.pause()
	})
	stream.on('error', () => {
		if (!aborted) res.close()
	})
}

function readJson(res, cb, err) {
	let buffer

	res.onData((ab, isLast) => {
		let chunk = Buffer.from(ab)
		if (isLast) {
			if (buffer) {
				cb(JSON.parse(Buffer.concat([buffer, chunk])))
			} else {
				cb(JSON.parse(chunk))
			}
		} else {
			if (buffer) {
				buffer = Buffer.concat([buffer, chunk])
			} else {
				buffer = Buffer.concat([chunk])
			}
		}
	})

	res.onAborted(err)
}
