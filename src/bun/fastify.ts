import fastify from "fastify"

const server = fastify()
  .get("/", () => "Hi")
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
