const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const { createReadStream } = require('node:fs')
const { extraRoutes } = require('../extra-routes.mjs')

const app = new Koa()
const router = new Router()

app.use(bodyParser())

for (const route of extraRoutes) {
	router.get(route, (ctx) => {
		ctx.body = 'ok'
	})
	router.post(`${route}/submit`, (ctx) => {
		ctx.body = 'ok'
	})
}

router
    .get('/', (ctx) => {
        ctx.body = 'Hi'
    })
    .get('/video', (ctx) => {
        ctx.type = 'video/mp4'
        ctx.body = createReadStream('public/kyuukurarin.mp4')
    })
    .get('/id/:id', (ctx) => {
        ctx.body = `${ctx.params.id} ${ctx.query.name ?? ''}`
        ctx.set('x-powered-by', 'benchmark')
    })
    .post('/json', (ctx) => {
        ctx.body = ctx.request.body
    })

app.use(router.routes())
app.use(router.allowedMethods())
app.listen(3000)
