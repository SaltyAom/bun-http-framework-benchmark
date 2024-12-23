const { Elysia } = require('elysia')
const { node } = require('@elysiajs/node')

const app = new Elysia({ adapter: node() })
	.get('/', () => 'Hi')
	.get('/id/:id', (c) => {
		c.set.headers['x-powered-by'] = 'benchmark'

		return `${c.params.id} ${c.query.name}`
	})
	.post('/json', (c) => c.body, {
		type: 'json'
	})
	.listen(3000)
