import { Elysia, file } from 'elysia'
import { extraRoutes } from '../extra-routes.mjs'

export const app = new Elysia()
const shared = () => 'ok'
for (const route of extraRoutes)
	app.get(route, 'ok').post(`${route}/submit`, shared)

app.get('/', 'Hi')
	.get('/video', file('public/kyuukurarin.mp4'))
	.get('/id/:id', (c) => {
		c.set.headers['x-powered-by'] = 'benchmark'

		return `${c.params.id} ${c.query.name ?? ''}`
	})
	.post(
		'/json',
		{
			parse: 'json'
		},
		(c) => c.body
	)

if (import.meta.main) app.listen(3000)
