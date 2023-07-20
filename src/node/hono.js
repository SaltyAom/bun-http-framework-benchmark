const { Hono } = require("hono")
const { serve } = require("@hono/node-server")
const { RegExpRouter } = require("hono/router/reg-exp-router")

const app = new Hono({ router: new RegExpRouter() })

app.get("/", (c) => c.text("Hi"))
	.post("/json", async (c) => c.json(await c.req.json()))
	.get("/id/:id", (c) => {
		const id = c.req.param("id")
		const name = c.req.query("name")

		c.header("x-powered-by", "benchmark")

		return c.text(`${id} ${name}`)
	})

serve(app)
