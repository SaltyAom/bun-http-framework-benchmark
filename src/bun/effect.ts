import { BunHttpServer, BunRuntime } from '@effect/platform-bun'
import { Layer } from 'effect'
import { HttpRouter } from 'effect/unstable/http'
import { effectRouter } from '../effect-router'

const app = HttpRouter.serve(effectRouter, {
	disableLogger: true,
	disableListenLog: true
}).pipe(Layer.provide(BunHttpServer.layer({ port: 3000 })))

BunRuntime.runMain(Layer.launch(app))
