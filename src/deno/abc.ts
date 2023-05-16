import { Application } from "https://deno.land/x/abc@v1.3.3/mod.ts"

new Application()
	.get("/", () => "Hi")
	.get("/id/:id", (ctx) => {
		ctx.response.headers.append("x-powered-by", "benchmark")

		return `${ctx.params.id} ${ctx.queryParams.name}`
	})
	.post("/json", (ctx) => ctx.body)
	.start({ port: 3000 })
