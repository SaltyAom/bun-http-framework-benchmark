import cheetah from 'https://deno.land/x/cheetah@v1.5.0/mod.ts'

new cheetah()
  .get('/', () => 'Hi')
  .get(
    '/id/:id',
    (c) => {
      c.res.header('x-powered-by', 'benchmark')

      return `${c.req.param('id')} ${(c.req.query as { name: string }).name}`
    }
  )
  .post('/json', (c) => c.req.json() as Promise<{ hello: string }>)
  .serve({ port: 3000 })
