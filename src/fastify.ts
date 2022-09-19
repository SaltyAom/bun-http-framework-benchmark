import { fastify, FastifyRequest } from 'fastify'

const xPoweredBy = 'benchmark'

const server = fastify({ logger: true })

server.get('/', async (req, res) => 'Hi')

server.post('/json', async ({ body }, res) => {
    return body
})

server.get(
    '/id/:id',
    async (
        {
            params: { id },
            query: { name }
        }: FastifyRequest<{
            Params: { id: string }
            Querystring: { name: string }
        }>,
        res
    ) => {
        res.header('x-powered-by', xPoweredBy)
        return `${id} ${name}`
    }
)

server.listen({ port: 3000 }, function (err) {
    if (err) {
        server.log.error(err)
        process.exit(1)
    }
})
