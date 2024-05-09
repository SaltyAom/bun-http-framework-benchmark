import { Elysia } from "elysia"

const app = new Elysia({ precompile: true })
	.get("/", "Hi")
	.post("/json", (context) => context.body, {
		type: "json"
	})
	.get("/id/:id", ({ set, params: { id }, query: { name } }) => {
		set.headers["x-powered-by"] = "benchmark"

		return id + ' ' + name
	})
	.listen(3000)
