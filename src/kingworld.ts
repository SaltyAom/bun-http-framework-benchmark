import KingWorld from 'kingworld'

const app = new KingWorld()

const xPoweredBy = 'benchmark'

app.get('/', () => 'Hi')
    .post('/json', ({ body }) => body)
    .get('/id/:id', ({ params: { id }, query: { name }, responseHeaders }) => {
        responseHeaders.set('x-powered-by', xPoweredBy)

        return `${id} ${name}`
    })
    .listen(3000)

export default app
