import Colston from 'colstonjs'

const app = new Colston()
const xPoweredBy = 'benchmark'

app.get('/', (ctx) => ctx.text('Hi'))
    .post('/json', (ctx) => ctx.json(ctx.request.json()))
    .get('/id/:id', (ctx) => {
        const id = ctx.request.params.id

        /**
         * to handle this, we need to define a separate route:
         * app.get('/framework?name', (ctx) => ctx.text(ctx.request.query.name))
         * 
         * send a request matching this pattern
         * /framework?name=colston 
         */
        const name = ctx.request.query.name // undefined

        ctx.setHeader('x-powered-by', xPoweredBy)
        // ctx.response.headers.set('x-powered-by', xPoweredBy)

        return ctx.text(`${id} ${name}`)
    })

// The issie was fixed in here: https://github.com/ajimae/colstonjs/pull/4 and release in v0.1.0-beta.4
// It should work fine now
// throw new Error('Unable to get it to work for some reason')

app.start(3000, () => console.log(`server listening on port :3000`))
