import { Router } from "@stricjs/router"
import { URLParser } from "@stricjs/utils"

export default new Router()
	.use("GET", "/", () => new Response("Hi"))
	.use(
		"POST",
		"/json",
		async (req) =>
			new Response(JSON.stringify(await req.json()), {
				headers: { "content-type": "application/json" }
			})
	)
	.use("GET", "/id/:id", (req) => {
		const name = new URLSearchParams(URLParser.query(req.url)).get("name")

		return new Response(`${req.params.id} ${name}`, {
			headers: { "x-powered-by": "benchmark" }
		})
	})
