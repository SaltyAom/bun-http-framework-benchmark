import { KingWorld, t } from 'kingworld'

const app = new KingWorld()

const xPoweredBy = 'benchmark'

app.get('/', () => 'Hi')
    .post('/json', (ctx) => ctx.body)
    .get('/id/:id', (ctx) => `${ctx.params.id} ${ctx.query.name}`)
    .listen(3000)

export default app
