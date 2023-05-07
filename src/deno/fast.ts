import fast from "https://deno.land/x/fast@6.0.0-alpha.1/mod.ts"

const app = fast()

app.get("/", () => "Hi")
app.get(
	"/id/:id",
	(ctx) =>
		new Response(
			`${ctx.params.id} ${new URL(ctx.request.url).searchParams.get(
				"name"
			)}`,
			{
				headers: {
					"x-powered-by": "benchmark"
				}
			}
		)
)
app.post("/json", (ctx) => ctx.body)

await app.serve({
	port: 3000
})
