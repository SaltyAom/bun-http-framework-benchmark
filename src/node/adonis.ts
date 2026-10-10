import { createServer } from 'node:http'
import { createReadStream } from 'node:fs'
import { defineConfig, Server } from '@adonisjs/http-server'
import { Logger } from '@adonisjs/logger'
import { Emitter } from '@adonisjs/events'
import { Encryption } from '@boringnode/encryption'
import { chacha20poly1305 } from '@boringnode/encryption/drivers/chacha20_poly1305'
import { Application } from '@adonisjs/application'
import { defineConfig as defineBodyParserConfig } from '@adonisjs/bodyparser'
import { BodyParserMiddleware } from '@adonisjs/bodyparser/bodyparser_middleware'
import { extraRoutes } from '../extra-routes.mjs'

const app = new Application(new URL('./', import.meta.url), {
  environment: 'web',
  importer: () => {}
})

await app.init()

const encryption = new Encryption(
  chacha20poly1305({ id: 'app', keys: ['averylongrandom32charslongsecret'] })
)

const server = new Server(
  app,
  encryption,
  new Emitter(app),
  new Logger({ enabled: false }),
  defineConfig({
    router: { matcher: 'tree' }
  })
)

const bodyParser = new BodyParserMiddleware(defineBodyParserConfig({}))
const router = server.getRouter()

for (const route of extraRoutes) {
  router.get(route, () => 'ok')
  router.post(`${route}/submit`, () => 'ok')
}

router.get('/', () => 'Hi')

router.get('/video', ({ response }) => {
  response.header('content-type', 'video/mp4')
  response.stream(createReadStream('public/kyuukurarin.mp4'))
})

router.get('/id/:id', ({ params, request, response }) => {
  response.header('x-powered-by', 'benchmark')
  return `${params.id} ${request.qs().name}`
})

router
  .post('/json', ({ request }) => request.body())
  .use((ctx, next) => bodyParser.handle(ctx, next))

await server.boot()

createServer(server.handle.bind(server)).listen(3000)
