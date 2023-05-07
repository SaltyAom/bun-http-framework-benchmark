import { Router } from "https://deno.land/x/acorn@0.2.0/mod.ts"

const app = new Router()

app.get("/", () => 'Hi')
app.get("/id/:id", (ctx) => {
	return new Response(`${ctx.params.id} ${ctx.searchParams.name}`, {
		headers: {
			"x-powered-by": "benchmark"
		}
	})
})
app.post("/json", (ctx) => ctx.body())

app.listen({ port: 3000 })
