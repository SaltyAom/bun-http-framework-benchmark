import { H3, serve } from 'h3'
import { extraRoutes } from '../extra-routes.mjs'
import { createReadStream } from 'node:fs'

const app = new H3()

const routeHandler = () => 'ok'
for (const route of extraRoutes) {
	app.get(route, routeHandler)
	app.post(`${route}/submit`, routeHandler)
}

app.get('/', () => 'Hi')

app.get(
	'/video',
	((event) => {
		event.res.headers.set('content-type', 'video/mp4')
		return createReadStream('public/kyuukurarin.mp4')
	})
)

app.get(
	'/id/:id',
	((event) => {
		const name = event.url.searchParams.get('name') 
		event.res.headers.set('x-powered-by', 'benchmark')
		return `${event.context.params?.id} ${name}`
	}))

app.post('/json', ((event) => event.req.json()))

serve(app, { port: 3000 })
