const fastify = require("fastify");

const server = fastify()
  .get("/", (req, res) => "Hi")
  .get(
    "/id/:id",
    (
      req,
      res
    ) => {
      res.header("x-powered-by", "benchmark");
      return `${req.params.id} ${req.query.name}`;
    }
  )
  .post(
    "/json",
    {
      schema: {
        response: {
          200: {
            type: "object",
            properties: {
              hello: {
                type: "string",
              },
            },
          },
        },
      },
    },
    (req, res) => req.body
  )


server.listen({ port: 3000 }, function (err) {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});
