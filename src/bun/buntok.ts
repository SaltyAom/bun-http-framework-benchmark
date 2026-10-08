import { Buntok, file } from '@buntok/core'
import { extraRoutes } from '../extra-routes.mjs'

const app = new Buntok()
app.disable('x-powered-by')
app.disable('logger')

for (const route of extraRoutes) {
	app.get(route, 'ok')
	app.post(`${route}/submit`, 'ok')
}

app.get('/', 'Hi')
	.get('/video', () => file('public/kyuukurarin.mp4'))
	.get('/jpg', () => file('public/nihaha.jpg'))
	.get('/id/:id', (ctx) => {
		ctx.set.headers['x-powered-by'] = 'benchmark'
		return ctx.text(`${ctx.params.id} ${ctx.query.name}`)
	})
	.post('/json', async (ctx) => ctx.json(await ctx.body()))

if (import.meta.main) app.listen(3000)
