import { NodeHttpServer, NodeRuntime } from '@effect/platform-node'
import { Layer } from 'effect'
import { HttpRouter } from 'effect/unstable/http'
import { createServer } from 'node:http'
import { effectRouter } from '../effect-router'

const app = HttpRouter.serve(effectRouter, {
	disableLogger: true,
	disableListenLog: true
}).pipe(
	Layer.provide(NodeHttpServer.layer(() => createServer(), { port: 3000 }))
)

NodeRuntime.runMain(Layer.launch(app))
