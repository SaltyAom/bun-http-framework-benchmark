import bunnet from 'bunnet'

const app = bunnet()

app.get('/', (req, res) => res.send('Hi'))

app.post('/json', async (req, res) => res.json(await req.json()))

app.get('/id/:id', ({ params: { id }, query: { name } }, res) => {
	res.headers({ 'x-powered-by': 'benchmark' }).send(`${id} ${name}`)
})

app.listen(3000)
