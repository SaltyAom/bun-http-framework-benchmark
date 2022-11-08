import Colston from 'colstonjs'

const app = new Colston()
const xPoweredBy = 'benchmark'

// ? Got "TypeError: Attempted to assign to readonly property." for all route
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

        return ctx.text(`${id} ${name}`)
    })

app.start(3000, () => console.log(`server listening on port :3000`))
