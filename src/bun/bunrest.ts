import Server from 'bunrest'

const app = Server()
const xPoweredBy = 'benchmark'

app.get('/', (req, res) => {
    res.send('Hi')
})

// ? Can't read body
app.post('/json', async (req, res) => {
    res.send(await req.json())
})

// ? Named parameter not implemented?
app.get('/id/:id', ({ params: { id }, query: { name } }, res) => {
    const headers = new Headers()
    headers.set('x-powered-by', xPoweredBy)

    res.headers(headers)
    res.send(`${id} ${name}`)
})

app.listen(3000)
