import { Application, Router } from "@oak/oak"
import { extraRoutes } from '../extra-routes.mjs'

const router = new Router()
for (const route of extraRoutes) {
	router.get(route, (context) => {
		context.response.body = 'ok'
	})
	router.post(`${route}/submit`, (context) => {
		context.response.body = 'ok'
	})
}

router.get("/", (context) => {
		context.response.body = "Hi"
	})
	.get('/video', async (context) => {
		context.response.headers.set('content-type', 'video/mp4')
		context.response.body = (await Deno.open('public/kyuukurarin.mp4')).readable
	})
	.get("/id/:id", (context) => {
		context.response.headers.append("x-powered-by", "benchmark")
		context.response.body = `${
			context.params.id
		} ${context.request.url.searchParams.get("name")}`
	})
	.post("/json", async (context) => {
		context.response.body = await context.request.body.json()
	})

const app = new Application()
app.use(router.routes())
app.use(router.allowedMethods())

await app.listen({ port: 3000 })
