const { Server } = require('hyper-express')
const { createReadStream, statSync } = require('node:fs')
const { extraRoutes } = require('../extra-routes.mjs')

const app = new Server()
for (const route of extraRoutes) {
	app.get(route, (_req, res) => res.send('ok'))
	app.post(`${route}/submit`, (_req, res) => res.send('ok'))
}

app.get('/', (req, res) => {
	res.header('content-type', 'text/plain').send('Hi')
})

app.get('/video', (_req, res) => {
	res.header('content-type', 'video/mp4')
	return res.stream(
		createReadStream('public/kyuukurarin.mp4'),
		statSync('public/kyuukurarin.mp4').size
	)
})

app.get('/id/:id', (req, res) => {
	res.header('x-powered-by', 'benchmark')
	res.header('content-type', 'text/plain')

	res.send(`${req.path_parameters.id} ${req.query_parameters.name}`)
})

app.post('/json', async (req, res) => {
	res.type('json')
	res.send(JSON.stringify(await req.json()))
})

app.listen(3000)
