import { NodeHttpServer, NodeRuntime } from '@effect/platform-node'
import { Layer, References } from 'effect'
import { HttpRouter } from 'effect/http'
import { createServer } from 'node:http'
import { effectRouter } from '../effect-router'

const app = HttpRouter.serve(effectRouter, {
	disableLogger: true,
	disableListenLog: true
}).pipe(
	Layer.provide(NodeHttpServer.layer(() => createServer(), { port: 3000 })),
	// disableLogger does not cover the tracer middleware
	Layer.provide(Layer.succeed(References.TracerEnabled)(false))
)

NodeRuntime.runMain(Layer.launch(app))
