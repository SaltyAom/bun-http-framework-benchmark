import { Application, Router } from "https://deno.land/x/oak@v12.4.0/mod.ts"

const router = new Router()
	.get("/", (context) => {
		context.response.body = "Hi"
	})
	.get("/id/:id", (context) => {
		context.response.headers.append("x-powered-by", "benchmark")
		context.response.body = `${
			context.params.id
		} ${context.request.url.searchParams.get("name")}`
	})
	.post("/json", async (context) => {
		context.response.body = await context.request.body({
			type: "json"
		}).value
	})

const app = new Application()
app.use(router.routes())
app.use(router.allowedMethods())

await app.listen({ port: 3000 })
