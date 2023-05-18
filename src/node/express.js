const express = require('express')

express()
    .use(express.json())
    .get('/', (req, res) => res.send('Hi'))
    .post('/json', ({ body }, res) => res.json(body))
    .get('/id/:id', ({ params: { id }, query: { name } }, res) => {
        res.setHeader('x-powered-by', 'benchmark')

        res.send(`${id} ${name}`)
    })
    .listen(3000)
