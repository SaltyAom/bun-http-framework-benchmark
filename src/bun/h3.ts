import { H3 } from 'h3'
import { extraRoutes } from '../extra-routes.mjs'

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
		return Bun.file('public/kyuukurarin.mp4').stream()
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

Bun.serve({ port: 3000, fetch: app.fetch })
