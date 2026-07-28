import { Hono } from 'https://deno.land/x/hono@v4.3.11/mod.ts'
import { extraRoutes } from '../extra-routes.mjs'

const app = new Hono()
for (const route of extraRoutes) {
	app.get(route, (c) => c.text('ok'))
		.post(`${route}/submit`, (c) => c.text('ok'))
}

app.get('/', (c) => c.text('Hi'))
	.get('/video', async (c) => {
		c.header('content-type', 'video/mp4')
		return c.body((await Deno.open('public/kyuukurarin.mp4')).readable)
	})
	.post('/json', async (c) => c.json(await c.req.json()))
	.get('/id/:id', (c) => {
		const id = c.req.param('id')
		const name = c.req.query('name') ?? ''

		c.header('x-powered-by', 'benchmark')

		return c.text(`${id} ${name}`)
	})

Deno.serve(
	{
		port: 3000
	},
	app.fetch
)
