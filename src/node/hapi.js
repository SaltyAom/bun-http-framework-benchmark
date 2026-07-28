const Hapi = require("@hapi/hapi")
const { createReadStream } = require('node:fs')
const { extraRoutes } = require('../extra-routes.mjs')

const init = async () => {
	const server = Hapi.server({
		port: 3000,
		host: "localhost"
	})

	for (const route of extraRoutes) {
		server.route({ method: 'GET', path: route, handler: () => 'ok' })
		server.route({ method: 'POST', path: `${route}/submit`, handler: () => 'ok' })
	}

	server.route([
		{
			method: "GET",
			path: "/",
			handler: (request, h) => "Hi"
		},
		{
			method: 'GET',
			path: '/video',
			handler: (_request, h) =>
				h.response(createReadStream('public/kyuukurarin.mp4')).type('video/mp4')
		},
		{
			method: "POST",
			path: "/json",
			handler: (request, h) => h.response(request.payload)
		},
		{
			method: "GET",
			path: "/id/{id}",
			handler: (request, h) => {
				response.header("x-powered-by", "benchmark")
				return h.response(`${request.params.id} ${request.query.name}`)
			}
		}
	])

	await server.start()
	console.log("Server running on %s", server.info.uri)
}

init().catch((error) => {
	console.error(error)
	process.exit(1)
})
