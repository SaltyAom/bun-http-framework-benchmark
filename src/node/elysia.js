const { Elysia } = require("elysia")
const { node } = require("@elysiajs/node")

new Elysia()
	.get("/", () => "Hi")
	.get("/id/:id", (c) => {
		c.set.headers["x-powered-by"] = "benchmark"

		return `${c.params.id} ${c.query.name}`
	})
	.post("/json", (c) => c.body, {
		type: "json"
	})
	.use(node(3000))
