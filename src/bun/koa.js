const Koa = require('koa')
const Router = require('koa-tree-router')
const bodyParser = require('koa-bodyparser')

const app = new Koa()
const router = new Router()

app.use(bodyParser())

router
    .get('/', (ctx) => {
        ctx.body = 'Hi'
    })
    .get('/id/:id', (ctx) => {
        ctx.body = `${ctx.params.id} ${ctx.query.name}`
        ctx.set('x-powered-by', 'benchmark')
    })
    .post('/json', (ctx) => {
        ctx.body = ctx.request.body
    })

app.use(router.routes())
app.listen(3000)
