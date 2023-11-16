const { createServer } = require('http')
const {
	createApp,
	createRouter,
	eventHandler,
	toNodeListener,
	getQuery,
	setResponseHeader,
	readBody
} = require('h3')

const app = createApp()

const router = createRouter()

router.get(
	'/',
	eventHandler((event) => {
		setResponseHeader(event, 'content-type', 'text/plain')

		return 'Hi'
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
