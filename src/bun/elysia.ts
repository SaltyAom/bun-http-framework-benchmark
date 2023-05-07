import { Elysia } from "elysia"

new Elysia()
	.get("/", () => "Hi")
	.get("/id/:id", (ctx) => {
		ctx.set.headers["x-powered-by"] = "benchmark"

		return `${ctx.params.id} ${ctx.query.name}`
	})
	.post("/json", (ctx) => ctx.body, {
		type: "json"
	})
	.listen(3000)
