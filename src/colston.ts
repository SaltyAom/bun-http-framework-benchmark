import Colston from 'colstonjs'

const app = new Colston()
const xPoweredBy = 'benchmark'

app.get('/', (ctx) => ctx.text('Hi'))
    .post('/json', (ctx) => ctx.json(ctx.request.json()))
    .get('/id/:id', (ctx) => {
        const id = ctx.request.params.id
        const name = ctx.request.query.name

        ctx.response.headers.set('x-powered-by', xPoweredBy)

        return ctx.text(`${id} ${name}`)
    })

throw new Error('Unable to get it to work for some reason')

app.start(3000, () => console.log(`server listening on port :3000`))
