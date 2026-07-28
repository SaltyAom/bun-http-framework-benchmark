const uExpress = require('ultimate-express')
const { resolve } = require('node:path')
const { extraRoutes } = require('../extra-routes.mjs')

const app = uExpress()
app.set("etag", false)
app.set("x-powered-by", false)

for (const route of extraRoutes) {
	app.get(route, (_req, res) => res.send('ok'))
	app.post(`${route}/submit`, (_req, res) => res.send('ok'))
}

app.get('/', (req, res) => {
	res.setHeader('content-type', 'text/plain').send('Hi')
})

app.get('/video', (_req, res) => {
	res.sendFile(resolve('public/kyuukurarin.mp4'), {
		headers: { 'content-type': 'video/mp4' }
	})
})

app.post('/json', uExpress.json(), ({ body }, res) => {
	res.json(body)
})

app.get('/id/:id', ({ params: { id }, query: { name } }, res) => {
	res.setHeader('x-powered-by', 'benchmark')
		.setHeader('content-type', 'text/plain')
		.send(`${id} ${name}`)
})

app.listen(3000, () => {})
