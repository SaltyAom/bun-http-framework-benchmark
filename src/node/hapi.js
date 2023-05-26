const Hapi = require("@hapi/hapi")

const init = async () => {
	const server = Hapi.server({
		port: 3000,
		host: "localhost"
	})

	server.route([
		{
			method: "GET",
			path: "/",
			handler: (request, h) => "Hi"
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
