Bun.serve({
    port: 3000,
    fetch: async (request) => {
        const { url, method, json } = request
        const { pathname, searchParams } = new URL(url)

        if (method === 'GET' && pathname === '/') return new Response('Hi')
        if (method === 'POST' && pathname === '/json')
            return new Response(JSON.stringify(await request.json()), {
                headers: {
                    'content-type': 'application/json'
                }
            })

        if (method === 'GET' && pathname.startsWith('/id/')) {
            const [id, extraPath] = pathname.substring(4).split('/')

            if (!extraPath) {
                return new Response(`${id} ${searchParams.get('name')}`, {
                    headers: {
                        'x-powered-by': 'benchmark'
                    }
                })
            }
        }

        return new Response('Not Found', {
            status: 404
        })
    }
})
