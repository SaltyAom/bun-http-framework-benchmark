import { Effect } from 'effect'
import {
	HttpRouter,
	HttpServerRequest,
	HttpServerResponse
} from 'effect/unstable/http'
import { extraRoutes } from './extra-routes.mjs'

const ok = HttpServerResponse.text('ok')

export const effectRouter = HttpRouter.addAll([
	...(extraRoutes as Array<`/${string}`>).flatMap((route) => [
		HttpRouter.route('GET', route, ok),
		HttpRouter.route('POST', `${route}/submit`, ok)
	]),
	HttpRouter.route('GET', '/', HttpServerResponse.text('Hi')),
	HttpRouter.route(
		'GET',
		'/video',
		HttpServerResponse.file('public/kyuukurarin.mp4', {
			headers: { 'content-type': 'video/mp4' }
		})
	),
	HttpRouter.route(
		'GET',
		'/id/:id',
		Effect.gen(function* () {
			const { id } = yield* HttpRouter.params
			const search = yield* HttpServerRequest.ParsedSearchParams
			const name = search.name

			return HttpServerResponse.text(
				`${id} ${Array.isArray(name) ? name[0] : (name ?? '')}`,
				{ headers: { 'x-powered-by': 'benchmark' } }
			)
		})
	),
	HttpRouter.route(
		'POST',
		'/json',
		Effect.gen(function* () {
			const request = yield* HttpServerRequest.HttpServerRequest

			return HttpServerResponse.jsonUnsafe(yield* request.json)
		})
	)
])
