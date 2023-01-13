import { Router } from "@bunsvr/router"

const router = new Router()

router.use({
	path: "/",
	run: () => new Response("Hi")
})

router.use({
	method: "POST",
	path: "/json",
	run: async (request) =>
		new Response(await request.json(), {
			headers: {
				"content-type": "application/json"
			}
		})
})

router.use({
	method: "GET",
	path: "/id/*",
	run: (request) => {
		const { pathname, searchParams } = new URL(request.url)

		const [id, extraPath] = pathname.substring(4).split("/")

		if (extraPath)
			return new Response("NOT_FOUND", {
				status: 404
			})

		return new Response(`${id} ${searchParams.get("name")}`, {
			headers: {
				"x-powered-by": "benchmark"
			}
		})
	}
})

router.use({
	path: "*",
	run: () =>
		new Response("NOT_FOUND", {
			status: 404
		})
})

router.serve({
	baseURI: "http://localhost:3000",
	port: 3000
})
