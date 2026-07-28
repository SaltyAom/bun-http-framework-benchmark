const { createServer } = require('http')
const { createReadStream } = require('node:fs')
const { extraRoutes } = require('../extra-routes.mjs')
const {
	createApp,
	createRouter,
	eventHandler,
	toNodeListener,
	getQuery,
	setResponseHeader,
	readBody,
	sendStream
} = require('h3')

const app = createApp()

const router = createRouter()

for (const route of extraRoutes) {
	router.get(route, eventHandler(() => 'ok'))
	router.post(`${route}/submit`, eventHandler(() => 'ok'))
}

router.get(
	'/',
	eventHandler((event) => {
		setResponseHeader(event, 'content-type', 'text/plain')

		return 'Hi'
	})
)

router.get(
	'/video',
	eventHandler((event) => {
		setResponseHeader(event, 'content-type', 'video/mp4')
		return sendStream(event, createReadStream('public/kyuukurarin.mp4'))
	})
)

router.get(
	'/id/:id',
	eventHandler((event) => {
		const query = getQuery(event)

		setResponseHeader(event, 'content-type', 'text/plain')
		setResponseHeader(event, 'x-powered-by', 'benchmark')

		return `${event.context.params.id} ${query.name}`
	})
)

router.post(
	'/json',
	eventHandler((event) => readBody(event))
)

app.use(router)

createServer(toNodeListener(app)).listen(3000)
