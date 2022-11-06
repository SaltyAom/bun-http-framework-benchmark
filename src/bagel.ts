import { Bagel, Router } from '@kakengloh/bagel'

const app = new Bagel()

// 0.2.0 Handler is expected to return `Promise`, using async instead
app.get('/', async (req, res) => {
    res.send('Hi')
})
    .post('/json', async (req, res) => {
        res.json(req.body)
    })
    .get('/id/:id', async (req, res) => {
        res.setHeader('x-powered-by', 'benchmark')

        res.send(`${req.params.id} ${req.query.name}`)
    })

app.listen(3000)
