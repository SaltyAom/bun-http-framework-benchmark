import express from 'express'
import { createReadStream } from 'node:fs'
import { extraRoutes } from '../extra-routes.mjs'

const app = express().use(express.json())
for (const route of extraRoutes) {
	app.get(route, (_req, res) => res.send('ok'))
	app.post(`${route}/submit`, (_req, res) => res.send('ok'))
}

app
	.get('/', (req, res) => {
		res.setHeader('content-type', 'text/plain').send('Hi')
	})
	.get('/video', (_req, res) => {
		res.setHeader('content-type', 'video/mp4')
		createReadStream('public/kyuukurarin.mp4').pipe(res)
	})
	.post('/json', ({ body }, res) => {
		res.json(body)
	})
	.get('/id/:id', ({ params: { id }, query: { name } }, res) => {
		res.setHeader('x-powered-by', 'benchmark')
			.setHeader('content-type', 'text/plain')
			.send(`${id} ${name}`)
	})
	.listen(3000)
