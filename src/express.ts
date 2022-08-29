import express from 'express'

const app = express()
app.use(express.json())

const xPoweredBy = 'benchmark'

app.get('/', (req, res) => res.send('Hi'))

app.post('/json', ({ body }, res) => res.json(body))

app.get('/id/:id', ({ params: { id }, query: { name } }, res) => {
    res.setHeader('x-powered-by', xPoweredBy)

    res.send(`${id} ${name}`)
})

app.listen(3000)
