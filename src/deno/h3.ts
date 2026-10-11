import { H3, serve } from 'npm:h3@^2.0.1-rc.26'
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
	(async (event) => {
		event.res.headers.set('content-type', 'video/mp4')
		return (await Deno.open('public/kyuukurarin.mp4')).readable
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
