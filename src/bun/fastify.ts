import fastify from "fastify"
import { createReadStream } from 'node:fs'
import { extraRoutes } from '../extra-routes.mjs'

const server = fastify()
for (const route of extraRoutes) {
  server.get(route, () => 'ok').post(`${route}/submit`, () => 'ok')
}

server.get("/", () => "Hi")
  .get('/video', (_req, res) => {
    res.type('video/mp4')
    return createReadStream('public/kyuukurarin.mp4')
  })
  .get("/id/:id", (req, res) => {
    res.header("x-powered-by", "benchmark")
    return `${req.params.id} ${req.query.name}`
  })
  .post("/json", (req, _res) => req.body)

server.listen({ port: 3000 }, function (err) {
  if (err) {
    server.log.error(err)
    process.exit(1)
  }
});
