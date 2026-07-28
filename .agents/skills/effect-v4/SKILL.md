---
name: effect-v4
description: Write, review, benchmark, or upgrade Effect v4 beta code in this repository. Use for src/effect-router.ts, src/bun/effect.ts, src/node/effect.ts, effect/unstable/http, @effect/platform-bun, @effect/platform-node, core Effect/Layer/Context/Schema APIs, v3-to-v4 migrations, or Effect beta pin bumps. Verify unfamiliar APIs against the pinned repos/effect source oracle and keep all Effect packages on one exact beta.
---

# Effect v4

The Bun and Node Effect targets share one Effect HTTP router and run on the exact
Effect v4 beta recorded in [versions.json](versions.json). Ground claims in the
checked-in implementation and pinned upstream source, not in remembered v3 APIs.

## Authority order

1. Treat the benchmark contract in `README.md` and the compiling files under `src/`
   as the local behavior source of truth.
2. Verify package APIs against installed typings and `repos/effect` at its pinned
   release commit.
3. Use `repos/effect/migration/` to translate v3 code. Use web documentation only
   when the exact-beta source does not answer the question.

Keep `repos/effect` read-only. Never edit it or import runtime code from it.

## Read next

- Read [references/core-patterns.md](references/core-patterns.md) for generators,
  services, layers, typed errors, Promise boundaries, and high-value v3-to-v4
  translations.
- Read [references/http-server.md](references/http-server.md) before changing the
  router, requests, responses, Bun/Node adapters, server layers, or runtime launch.
- Read [references/upgrade-workflow.md](references/upgrade-workflow.md) before
  changing an Effect beta pin or advancing the source-oracle submodule.

## Workflow

1. Read the affected benchmark source and its matching reference above.
2. Search the exact source oracle before using an unfamiliar or unstable API:

   ```sh
   rg -n -- '<symbol>' repos/effect/packages
   ```

3. Preserve route parity between Bun and Node by changing shared behavior in
   `src/effect-router.ts`; keep runtime-specific wiring in `src/bun/effect.ts` and
   `src/node/effect.ts`.
4. Preserve the benchmark semantics in `README.md`, including dynamic path/query
   extraction, JSON parse-and-serialize behavior, streamed file responses, shared
   background routes, and disabled server logging.
5. Keep changes narrow. Do not add production-oriented middleware, tracing, or
   abstractions that distort benchmark startup, memory, bundle size, or throughput.

## Non-negotiables

- Pin `effect`, `@effect/platform-bun`, and `@effect/platform-node` to the same exact
  beta. Do not use `^`, `~`, or the floating `beta` dist-tag.
- Import v4 HTTP APIs from `effect/unstable/http`; do not restore v3
  `@effect/platform/Http*` imports.
- Use `Effect.gen` with `yield*` for generator workflows and
  `Effect.fn("name")(function*() { ... })` when a named Effect-returning function is
  useful.
- Define services with `Context.Service` and explicit layers. V4 does not generate a
  default layer.
- Model expected failures as typed tagged errors and recover with
  `Effect.catchTag`/`Effect.catchTags` or `Match`, not manual `_tag` comparisons.
- Use `Effect.tryPromise({ try, catch })` for fallible Promise boundaries.

## Verification

For source-or-skill edits, run the narrow relevant checks:

```sh
bun scripts/build-framework.ts bun/effect
bun scripts/build-framework.ts node/effect
```

Run `bun run verify` when router or server behavior changes; it exercises the shared
HTTP contract across the benchmark. After editing this skill, validate its frontmatter,
metadata, JSON, and relative links.
