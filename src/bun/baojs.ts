import Bao from 'baojs'

const app = new Bao()
const xPoweredBy = 'benchmark'

app.get('/', (ctx) => ctx.sendText('Hi'))

app.post('/json', async (ctx) => ctx.sendJson(await ctx.req.json()))

app.get('/id/:id', (ctx) => {
    const id = ctx.params.id
    const name = ctx.url.searchParams.get('name')

    // ? Got: TypeError: null is not an object (evaluating 'ctx.res.headers')
    // ctx.res.headers.append('x-powered-by', xPoweredBy)

    return ctx.sendRaw(
        new Response(`${id} ${name}`, {
            headers: {
                'x-powered-by': xPoweredBy
            }
        })
    )
})

app.listen({
    port: 3000
})
