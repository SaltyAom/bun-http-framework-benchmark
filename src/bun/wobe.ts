import { Wobe } from 'wobe'

new Wobe()
	.get('/', (ctx) => ctx.res.sendText('Hi'))
	.post('/json', async (ctx) => {
		return ctx.res.sendJson(await ctx.request.json())
	})
	.get('/id/:id', (ctx) => {
		ctx.res.headers.set('x-powered-by', 'benchmark')

		return ctx.res.sendText(ctx.params.id + ' ' + ctx.query.name)
	})
	.listen(3000)
