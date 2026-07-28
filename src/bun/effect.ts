import { BunHttpServer, BunRuntime } from '@effect/platform-bun'
import { Layer, References } from 'effect'
import { HttpRouter } from 'effect/unstable/http'
import { effectRouter } from '../effect-router'

const app = HttpRouter.serve(effectRouter, {
	disableLogger: true,
	disableListenLog: true
}).pipe(
	Layer.provide(BunHttpServer.layer({ port: 3000 })),
	// beta.102 traces every request by default; disableLogger does not cover the tracer middleware
	Layer.provide(Layer.succeed(References.TracerEnabled)(false))
)

BunRuntime.runMain(Layer.launch(app))
