import { Router } from '@oak/acorn'
import { extraRoutes } from '../extra-routes.mjs'

const app = new Router()
for (const route of extraRoutes) {
	app.get(route, () => new Response('ok'))
	app.post(`${route}/submit`, () => new Response('ok'))
}

app.get('/', () => new Response('Hi'))
app.get('/video', async () =>
	new Response((await Deno.open('public/kyuukurarin.mp4')).readable, {
		headers: { 'content-type': 'video/mp4' }
	})
)
app.get('/id/:id', async (ctx) => {
	return new Response(`${ctx.params.id} ${(await ctx.queryParams())?.name ?? ''}`, {
		headers: {
			'x-powered-by': 'benchmark'
		}
	})
})
app.post('/json', (ctx) => ctx.body())

app.listen({ port: 3000 })
