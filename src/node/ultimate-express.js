const uExpress = require('ultimate-express')

const app = uExpress()
app.set("etag", false)

app.get('/', (req, res) => {
	res.setHeader('content-type', 'text/plain').send('Hi')
})

app.post('/json', uExpress.json(), ({ body }, res) => {
	res.json(body)
})

app.get('/id/:id', ({ params: { id }, query: { name } }, res) => {
	res.setHeader('x-powered-by', 'benchmark')
		.setHeader('content-type', 'text/plain')
		.send(`${id} ${name}`)
})

app.listen(3000, () => {})
