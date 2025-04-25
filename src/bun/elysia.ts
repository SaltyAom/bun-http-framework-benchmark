import { Elysia, t } from 'elysia'

const app = new Elysia()
	.get('/', 'Hi')
	.get('/id/:id', (c) => {
		c.set.headers['x-powered-by'] = 'benchmark'

		return `${c.params.id} ${c.query.name}`
	})
	.post('/json', (c) => c.body, {
		parse: 'json'
	})
	.listen(3000)
