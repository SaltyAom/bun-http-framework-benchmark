import { fastify, FastifyRequest } from "fastify";

const server = fastify()
  .get("/", (req, res) => "Hi")
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
  .get(
    "/id/:id",
    (
      req,
      res
    ) => {
      res.header("x-powered-by", "benchmark");
      return `${req.params.id} ${req.query.name}`;
    }
  );

server.listen({ port: 3000 }, function (err) {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});
