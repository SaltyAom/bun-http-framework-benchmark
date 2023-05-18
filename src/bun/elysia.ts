import { Elysia } from "elysia"

new Elysia()
	.get("/", () => "Hi")
	.get("/id/:id", ({ set, params: { id }, query: { name } }) => {
		set.headers["x-powered-by"] = "benchmark"

		return `${id} ${name}`
	})
	.post("/json", ({ body }) => body, {
		type: "json"
	})
	.listen(3000)
