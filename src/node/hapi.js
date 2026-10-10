const Hapi = require('@hapi/hapi')
const { createReadStream } = require('node:fs')
const { extraRoutes } = require('../extra-routes.mjs')

const init = async () => {
	const server = Hapi.server({
		port: 3000,
		host: '127.0.0.1'
	})

	for (const route of extraRoutes) {
		const path = route.replace(/:([^/]+)/g, '{$1}')
		server.route({
			method: 'GET',
			path,
			handler: (_request, h) => h.response('ok').type('text/plain')
		})
		server.route({
			method: 'POST',
			path: `${path}/submit`,
			handler: (_request, h) => h.response('ok').type('text/plain')
		})
	}

	server.route([
		{
			method: 'GET',
			path: '/',
			handler: (_request, h) => h.response('Hi').type('text/plain')
		},
		{
			method: 'GET',
			path: '/video',
			handler: (_request, h) =>
				h.response(createReadStream('public/kyuukurarin.mp4')).type('video/mp4')
		},
		{
			method: 'POST',
			path: '/json',
			handler: (request, h) => h.response(request.payload)
		},
		{
			method: 'GET',
			path: '/id/{id}',
			handler: (request, h) =>
				h
					.response(`${request.params.id} ${request.query.name ?? ''}`)
					.type('text/plain')
					.header('x-powered-by', 'benchmark')
		}
	])

	await server.start()
}

init().catch((error) => {
	console.error(error)
	process.exit(1)
})
