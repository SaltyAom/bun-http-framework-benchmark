import { Diesel, type ContextType } from 'npm:diesel-core@^3.0.1'
import { extraRoutes } from '../extra-routes.mjs'

const app = new Diesel()
const ok = (c: ContextType) => c.text('ok')
for (const route of extraRoutes)
	app.get(route, ok).post(`${route}/submit`, ok)

app.get('/', (c) => c.text('Hi'))
	// .get('/video', (c) => c.file('public/kyuukurarin.mp4', 'video/mp4'))
	.get('/video', async () => new Response((await Deno.open('public/kyuukurarin.mp4')).readable, {
		headers: { 'content-type': 'video/mp4' }
	}))
	// .post('/json', async (c) => c.json(await c.body))
	.post('/json', (c) => c.req.json().then((body) => c.json(body)))
	.get('/id/:id', (c) => {
		c.setHeader('x-powered-by', 'benchmark')

		return c.text(`${c.params.id} ${c.query.name}`)
	})

Deno.serve({ port: 3000 }, app.fetch)
