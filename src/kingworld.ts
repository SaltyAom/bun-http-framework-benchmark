import { KingWorld, t } from 'kingworld'

new KingWorld()
    .get('/', () => 'Hi')
    .post('/json', (ctx) => ctx.body)
    .get('/id/:id', (ctx) => {
        ctx.responseHeaders['x-powered-by'] = 'benchmark'

        return `${ctx.params.id} ${ctx.query.name}`
    })
    .listen(3000)
