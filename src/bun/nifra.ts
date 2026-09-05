import { server } from '@nifrajs/core/server'
import { extraRoutes } from '../extra-routes.mjs'

export const app = server()
const ok = () => new Response('ok')
for (const route of extraRoutes) app.get(route, ok).post(`${route}/submit`, ok)

const text = { 'content-type': 'text/plain; charset=utf-8' }

app.get('/', () => new Response('Hi', { headers: text }))
	.get('/video', () => new Response(Bun.file('public/kyuukurarin.mp4')))
	.get('/id/:id', (c) =>
		new Response(`${c.params.id} ${c.query.get('name') ?? ''}`, {
			headers: { ...text, 'x-powered-by': 'benchmark' }
		})
	)
	.post('/json', (c) => c.req.json())

if (import.meta.main) app.listen(3000)
