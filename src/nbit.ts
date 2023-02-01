import { createApplication } from "@nbit/bun"

const { defineRoutes, attachRoutes } = createApplication()

const xPoweredBy = "benchmark"

const routes = defineRoutes((app) => [
	app.get("/", () => "Hi"),
	app.post("/json", async (request) => request.json()),
	app.get("/id/:id", async (request) => {
		const id = request.params.id
		const name = request.query.get("name")

		return new Response(`${id} ${name}`, {
			headers: {
				"x-powered-by": xPoweredBy
			}
		})
	})
])

Bun.serve({
	port: 3000,
	fetch: attachRoutes(routes)
})
