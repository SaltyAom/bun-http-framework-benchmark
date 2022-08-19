import { Hono } from 'hono'
import { RegExpRouter } from 'hono/router/reg-exp-router'

const app = new Hono({ router: new RegExpRouter() })

const xPoweredBy = 'benchmark'

app.get('/', (c) => c.text('Hi'))
    .post('/json', async (c) => c.json(await c.req.json()))
    .get('/id/:id', (c) => {
        const id = c.req.param('id')
        const name = c.req.query('name')

        c.header('x-powered-by', xPoweredBy)

        return c.text(`${id} ${name}`)
    })

export default app
