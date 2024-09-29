import {
    toWebHandler,
	createApp,
	createRouter,
	eventHandler,
	toNodeListener,
	getQuery,
	setResponseHeader,
	readBody
} from 'h3'

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

		return `${event.context.params?.id} ${query.name}`
	})
)

router.post(
	'/json',
	eventHandler((event) => readBody(event))
)

app.use(router)

Bun.serve({
    port: 3000,
    fetch: toWebHandler(app) as any
})