import { Hono, RegExpRouter } from 'https://deno.land/x/hono@v4.3.11/mod.ts'

const app = new Hono({ router: new RegExpRouter() })

app.get('/', (c) => c.text('Hi'))
	.post('/json', (c) => c.req.json().then(c.json))
	.get('/id/:id', (c) => {
		const id = c.req.param('id')
		const name = c.req.query('name')

		c.header('x-powered-by', 'benchmark')

		return c.text(`${id} ${name}`)
	})

Deno.serve(
	{
		port: 3000
	},
	app.fetch
)
