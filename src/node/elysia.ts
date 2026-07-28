import { node } from '@elysia/node'
import { Elysia, file } from 'elysia'
import { extraRoutes } from '../extra-routes.mjs'

export const app = new Elysia({ adapter: node() })
const shared = () => 'ok'
for (const route of extraRoutes)
	app.get(route, () => shared).post(`${route}/submit`, shared)

app.get('/', () => 'Hi')
	.get('/video', file('public/kyuukurarin.mp4'))
	.get('/id/:id', (c) => {
		c.set.headers['x-powered-by'] = 'benchmark'

		return `${c.params.id} ${c.query.name ?? ''}`
	})
	.post(
		'/json',
		{
			type: 'json'
		},
		(c) => c.body
	)

if (!process.env.ELYSIA_AOT_BUILD) app.listen(3000)
