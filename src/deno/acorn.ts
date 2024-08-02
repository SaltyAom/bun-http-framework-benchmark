import { Router } from '@oak/acorn'

const app = new Router()

app.get('/', () => new Response('Hi'))
app.get('/id/:id', async (ctx) => {
	return new Response(`${ctx.params.id} ${(await ctx.queryParams()).name}`, {
		headers: {
			'x-powered-by': 'benchmark'
		}
	})
})
app.post('/json', (ctx) => ctx.body())

app.listen({ port: 3000 })
