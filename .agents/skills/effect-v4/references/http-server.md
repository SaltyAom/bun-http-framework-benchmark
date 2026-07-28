# Effect v4 HTTP server surface

This repository uses the beta HTTP stack from `effect/unstable/http`, with official
Bun and Node adapters. The compile-checked local implementation is the first source of
truth:

- `src/effect-router.ts` owns shared routes and handlers.
- `src/bun/effect.ts` owns Bun server/runtime wiring.
- `src/node/effect.ts` owns Node server/runtime wiring.

## Router and handlers

Import the grouped HTTP modules from the unstable barrel:

```ts
import {
  HttpRouter,
  HttpServerRequest,
  HttpServerResponse
} from "effect/unstable/http"
```

At beta.102, `HttpRouter.route(method, path, handler)` accepts a static response, an
Effect producing a response, or a request-to-Effect function. `HttpRouter.addAll`
combines route values into the router layer used by both runtimes.

Use the services exposed by the route context:

- `yield* HttpRouter.params` for path parameters.
- `yield* HttpServerRequest.ParsedSearchParams` for parsed query parameters.
- `yield* HttpServerRequest.HttpServerRequest` for the request service.
- `yield* request.json` to parse a JSON request body.

Build responses with `HttpServerResponse`. The current benchmark uses `text`,
`jsonUnsafe`, and `file`; preserve their externally observable contract when changing
handlers. `file` relies on platform services and is intentionally used for the
streamed-video route.

Verify signatures in:

```text
repos/effect/packages/effect/src/unstable/http/HttpRouter.ts
repos/effect/packages/effect/src/unstable/http/HttpServerRequest.ts
repos/effect/packages/effect/src/unstable/http/HttpServerResponse.ts
```

## Server layers

Build one application layer from the shared router:

```ts
const app = HttpRouter.serve(effectRouter, {
  disableLogger: true,
  disableListenLog: true
})
```

Keep both logging options disabled: request and listen logging change benchmark work
and output.

Provide the runtime adapter outside the shared router:

```ts
Layer.provide(BunHttpServer.layer({ port: 3000 }))
Layer.provide(NodeHttpServer.layer(() => createServer(), { port: 3000 }))
```

Launch the complete layer with the matching runtime:

```ts
BunRuntime.runMain(Layer.launch(app))
NodeRuntime.runMain(Layer.launch(app))
```

The adapter implementations are:

```text
repos/effect/packages/platform-bun/src/BunHttpServer.ts
repos/effect/packages/platform-node/src/NodeHttpServer.ts
```

Do not move adapter services into `src/effect-router.ts`; that would make the shared
router runtime-specific.

## Benchmark boundaries

- Keep route behavior identical across Bun and Node.
- Keep dynamic background routes sourced from `src/extra-routes.mjs`.
- Do not hard-code query offsets or benchmark fixture values.
- Do not add default middleware, logging, tracing, or per-request allocation solely
  for production ergonomics.
- Treat any unstable HTTP API change during a beta bump as a behavior change: rebuild
  both targets and run the verifier.
