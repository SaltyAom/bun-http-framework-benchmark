# Effect v4 core patterns

Use these as orientation, then confirm exact signatures in `repos/effect`. The beta
source is authoritative.

## Generator workflows

Use `Effect.gen` and `yield*` for sequential Effect code:

```ts
const program = Effect.gen(function* () {
  const value = yield* loadValue
  return yield* persistValue(value)
})
```

Use `Effect.fn("descriptiveName")(function* (...) { ... })` for reusable named
Effect-returning functions when the name improves traces and diagnostics.

## Services and layers

Effect v4 replaces v3 `Context.Tag`, `Context.GenericTag`, and `Effect.Service` with
`Context.Service`. Define the service shape and construct its layer explicitly:

```ts
interface ClockShape {
  readonly now: Effect.Effect<number>
}

class Clock extends Context.Service<Clock, ClockShape>()("benchmark/Clock") {
  static readonly Default = Layer.succeed(Clock, {
    now: Effect.sync(() => Date.now())
  })
}
```

Use `Clock.of({...})` when constructing a service value for a test or local layer.
Compose dependencies with `Layer.provide`, `Layer.provideMerge`, and `Layer.mergeAll`;
verify the resulting requirements in the inferred `Layer.Layer<Out, Error, In>` type.

## Typed expected failures

Use `Data.TaggedError` for ordinary expected failures:

```ts
class InvalidInput extends Data.TaggedError("InvalidInput")<{
  readonly input: unknown
  readonly cause?: unknown
}> {}
```

Use `Schema.TaggedErrorClass` when the error must participate in Schema
encoding/decoding. Recover with `Effect.catchTag`, `Effect.catchTags`, `Match`, or a
`Predicate.isTagged` guard; avoid direct `_tag` string comparisons.

## Promise boundaries

Use `Effect.tryPromise({ try, catch })` for a Promise that can reject and map the
rejection into a typed error. Use `Effect.promise` only when rejection should be a
defect.

## High-value v3-to-v4 translations

This table is historical recognition guidance, not a substitute for source lookup.
The complete generated map is `repos/effect/migration/v3-to-v4.md`.

| Effect v3 | Effect v4 |
| --- | --- |
| `Context.Tag`, `Context.GenericTag`, `Effect.Service` | `Context.Service` |
| generated service `.Default` | explicit `Layer.succeed` / `Layer.effect` / `Layer.provide` |
| `@effect/platform/HttpRouter` and related HTTP modules | `effect/unstable/http` |
| `Effect.catchAll` / `catchAllCause` / `catchSome` | `Effect.catch` / `catchCause` / `catchFilter` |
| `Either` | `Result`; use `Effect.fromResult(...)` in an Effect workflow |
| `Schema.decodeUnknown` / `decode` / `encode` | `Schema.decodeUnknownEffect` / `decodeEffect` / `encodeEffect` |
| `Schema.Literal(a, b)` / `Schema.Union(A, B)` | `Schema.Literals([a, b])` / `Schema.Union([A, B])` |
| `Schema.Record({ key, value })` | `Schema.Record(key, value)` |
| `.annotations({...})` | `.annotate({...})` |
| `Effect.runtime<R>()` + `Runtime.runPromise` | `Effect.context<R>()` + `Effect.runPromiseWith` |

For any beta-to-beta drift, search the pinned source and migration files instead of
extending this table from memory.
