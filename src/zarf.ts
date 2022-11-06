import { Zarf } from '@zarfjs/zarf'

const app = new Zarf()

app.get('/', (ctx) => ctx.send('Hi'))

app.post('/json', async (ctx) => {
    const body = await ctx.request!.json()

    return ctx.json(body ?? {})
})

app.get('/id/:id', async (ctx, params) => {
    ctx.setHeader('x-powered-by', 'benchmark')

    return ctx.send(`${params.id} ${ctx.query?.get('name')}`)
})
