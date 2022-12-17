import { fastify, FastifyRequest } from 'fastify'

const server = fastify()

server.get('/', (req, res) => 'Hi')

server.post(
    '/json',
    {
        schema: {
            response: {
                200: {
                    type: 'object',
                    properties: {
                        hello: {
                            type: 'string'
                        }
                    }
                }
            }
        }
    },
    ({ body }, res) => body
)

server.get(
    '/id/:id',
    (
        {
            params: { id },
            query: { name }
        }: FastifyRequest<{
            Params: { id: string }
            Querystring: { name: string }
        }>,
        res
    ) => {
        res.header('x-powered-by', 'benchmark')
        return `${id} ${name}`
    }
)

server.listen({ port: 3000 }, function (err) {
    if (err) {
        server.log.error(err)
        process.exit(1)
    }
})
