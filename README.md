# Bun HTTP Framework Benchmark

Compare throughput benchmarks from various JavaScript HTTP framework

# Prerequistes

- [bombardier](https://github.com/codesenberg/bombardier)
- Nodejs
- Deno
- Bun

# Run Test

```typescript
bun benchmark
```

To run only specific targets, pass their runtime-qualified names:

```sh
bun benchmark bun/elysia node/effect
```

To select frameworks and optionally cap requests per second:

```sh
bun benchmark --interactive
```

To build and verify every supported framework without running a load test:

```sh
bun run verify
```

The verifier starts frameworks one at a time and checks the three core routes,
the streamed video, and all background routes. Targets in the benchmark
blacklist are skipped.

Select frameworks with the arrow keys and Space, then press Enter and enter an
RPS limit. Use `0` or leave it blank for unlimited throughput. Results include
the emitted minified bundle size, startup time, and server RSS memory as
`before / after MB` in one column. Deno reports `n/a` for bundle size because it
runs directly.

Dump result will be available at `results/[benchmark-name].txt`

All Bun and Node targets are minified with `Bun.build` before their server
startup timer begins.

Effect HTTP v4 beta is included for both Bun and Node using one shared router
and the official adapter for each runtime.

Hapi targets are included for both Bun and Node with the same route contract.

Elysia AOT variants are included for both Bun and Node.

Deno targets run directly because `Bun.build` has no Deno target.

Test method: Average throughput

Every implementation registers the same deterministic background routes before
the measured routes. These routes are not requested during the load test; they
make route lookup and startup closer to a small real-world service while keeping
every run reproducible.

Their shared path list lives in `src/extra-routes.mjs` and every handler returns
`ok`.

1. Ping
    - Request to [GET] `/`
    - Return `Hi`
    - Headers must contains text `Content-Type: text/plain`, additional context is acceptable eg. `Content-Type: text/plain; charset=utf-8`
2. Query
    - Request to [GET] `/id/:id`
    - Extract path parameter, query string and setting headers.
    - For this benchmark, the request URL will be send as: `/id/1?name=bun`
    - Headers must contains `x-powered-by` to `benchmark`
    - Expected response: **"1 bun"** (`${id} ${query}`)
        - You **MUST NOT use hardcode string or index** to extract querystring.
        - In a real-world situation, there's no enforcement that the request will follow the specification, using hardcode index to extract `name=bun` querystring will be prone to error.
        - To test if it pass the requirement, the implementation should be able to extract querystring **dynamically** (please treat the value of 'name=bun' can be any value beside 'bun', for example 'alice', 'hina'), which means that the same code should be able to extract querystring, for example:
        - `/id/1?name=bun&id=1` -> should return `1 bun` not `1 bun&id=1`
        - `/id/1?id=1` -> should return `1 `
        - Query beside `name` maybe not need to be extracted and is optional
    - Headers must contains text `Content-Type: text/plain`, additional context is acceptable eg. `Content-Type: text/plain; charset=utf-8`
3. Body
    - [POST] `/json`
    - Mirror body to response
    - Server **MUST parse body to JSON and serialize back to string**
    - For the benchmark, the request body will be sent as: `{ "hello": "world" }`
    - Expected response: `{ "hello": "world" }`
    - Headers must contains text `Content-Type: application/json`, additional context is acceptable eg. `Content-Type: application/json; charset=utf-8`.
4. Video
    - [GET] `/video`
    - Stream `public/kyuukurarin.mp4` without buffering the whole file in application memory.
    - Headers must contain `Content-Type: video/mp4`.
    - Uses 10 concurrent connections instead of 500 because the file is 14.1 MB.
    - Sends `Cache-Control: no-store` and a deliberately non-matching `If-None-Match` value, and requires `200`, so every request transfers the full file even when the server emits an ETag.

## Requirement

- The framework must at-least has latest published in less than 9 month otherwise will be classified as unmaintained and removed unless is an industry standard (Express).

## Test machine specification

- Intel Core i7-13700K, DDR5 32GB 5600MHz
- Bun 1.4.2
- Node 26.1.0
- Deno 2.9.4

```
$ uname -a
Linux seia 7.0.11-1-cachyos #1 SMP PREEMPT_DYNAMIC Wed, 03 Jun 2026 22:05:15 +0000 x86_64 GNU/Linux
```

## Results

These results are measured in req/s:

| Framework         | Runtime | Average     | Ping       | Query      | Body       | Video    | Bundle Size | Startup  | Memory Before/After |
| ----------------- | ------- | ----------: | ---------: | ---------: | ---------: | -------: | ----------: | -------: | ------------------: |
| uws               | node    | 267,539.538 | 427,506.83 | 411,801.95 | 230,413.43 |   435.94 |      2.3 KB |  20.1 ms |     88.1 / 157.5 MB |
| elysia-aot        | bun     |  214,292.24 | 406,697.05 | 234,341.51 | 214,486.37 | 1,644.03 |    136.3 KB |  14.9 ms |      41.5 / 47.7 MB |
| elysia            | bun     | 211,479.165 | 401,797.83 | 228,541.11 | 213,956.63 | 1,621.09 |    186.8 KB |  19.4 ms |      42.2 / 53.5 MB |
| h3                | bun     |  175,002.33 | 273,486.49 | 220,878.32 | 204,062.24 | 1,582.27 |     31.1 KB |   8.3 ms |      38.6 / 55.0 MB |
| bun               | bun     | 172,688.678 | 228,215.23 | 250,148.42 |    210,719 | 1,672.06 |      2.3 KB |   4.0 ms |      26.8 / 38.6 MB |
| hono              | bun     | 170,921.795 | 275,035.51 | 223,641.03 |  183,408.6 | 1,602.04 |     19.7 KB |   6.9 ms |      38.6 / 55.0 MB |
| ultimate-express  | node    | 170,538.755 |  426,490.8 | 119,311.01 | 135,912.21 |      441 |    583.5 KB |  52.1 ms |    121.3 / 255.1 MB |
| hono              | deno    | 169,209.773 | 273,599.16 |  189,177.8 | 213,638.82 |   423.31 |         n/a |  50.7 ms |     66.6 / 101.0 MB |
| deno              | deno    | 169,107.425 |  237,435.7 |  204,791.3 | 233,778.87 |   423.83 |         n/a |  13.6 ms |      58.8 / 87.9 MB |
| bun-web-standard  | bun     | 161,900.825 | 229,175.62 | 199,031.23 | 217,750.76 | 1,645.69 |      1.7 KB |   4.2 ms |      32.3 / 45.9 MB |
| deno-web-standard | deno    | 161,369.318 | 230,415.46 | 179,503.32 | 235,131.45 |   427.04 |         n/a |  13.9 ms |      58.8 / 88.8 MB |
| hyper-express     | node    | 141,213.188 |  227,541.2 | 188,591.08 | 148,339.19 |   381.28 |    247.2 KB |  37.9 ms |     94.9 / 218.3 MB |
| h3                | deno    | 131,389.895 | 201,342.34 | 155,474.32 | 168,317.99 |   424.93 |         n/a |  31.1 ms |     73.9 / 160.7 MB |
| effect            | bun     | 123,653.338 | 204,687.35 | 164,655.54 |  123,638.7 | 1,631.76 |    221.8 KB |  43.4 ms |      52.9 / 81.4 MB |
| fastify           | node    | 102,489.217 | 152,361.85 | 143,803.26 | 113,434.09 |   357.67 |    556.8 KB |  92.7 ms |    110.6 / 226.5 MB |
| h3                | node    |  99,251.775 | 150,208.82 | 131,830.13 | 114,612.41 |   355.74 |     50.4 KB |  58.1 ms |    101.5 / 202.7 MB |
| elysia            | node    |  95,765.988 | 147,038.23 | 123,805.77 | 111,997.91 |   222.04 |    212.2 KB |  53.0 ms |    109.4 / 178.1 MB |
| elysia-aot        | node    |  94,701.065 | 144,243.12 | 123,152.37 | 111,177.84 |   230.93 |    153.4 KB |  64.3 ms |    109.3 / 197.0 MB |
| hono              | node    |  93,065.377 | 147,588.11 | 118,830.48 | 105,616.09 |   226.83 |     52.8 KB |  52.8 ms |    114.5 / 226.0 MB |
| effect            | node    |  88,971.698 | 144,773.42 | 121,939.74 |  88,811.15 |   362.48 |    281.7 KB |  68.4 ms |    109.9 / 190.5 MB |
| express           | bun     |  63,314.903 |     95,290 |  88,116.25 |  69,548.58 |   304.78 |    836.2 KB |  42.5 ms |     69.0 / 183.9 MB |
| koa               | node    |   44,275.58 |  66,311.56 |  61,621.43 |  48,835.77 |   333.56 |    729.6 KB |  53.9 ms |    111.6 / 217.4 MB |
| express           | node    |  43,925.568 |  66,430.54 |  59,207.56 |  49,716.05 |   348.12 |    616.3 KB |  48.7 ms |    104.3 / 238.4 MB |
| adonis            | node    |   37,953.88 |  51,327.47 |  47,327.07 |  52,834.61 |   326.37 |      1.2 MB | 160.7 ms |    122.6 / 216.8 MB |
| nest              | node    |  33,531.098 |  50,529.64 |  46,320.41 |  36,935.41 |   338.93 |      1.2 MB |  89.9 ms |    135.4 / 221.7 MB |
| oak               | deno    |   24,275.09 |  35,525.34 |  34,640.89 |  26,687.44 |   246.69 |         n/a |  53.3 ms |    103.1 / 199.8 MB |
| acorn             | deno    |  10,310.233 |  13,344.05 |  13,731.82 |  13,891.18 |   273.88 |         n/a |  77.1 ms |    106.3 / 230.8 MB |

#### Note
1. uws, hyperexpress and ultimate-express bundle size is not accurate because uwebsocket is a native binary that can't be compiled to single bundle, and bundle size is vary based on operating system and CPU architecture
2. uws is a C++ framework with JavaScript binding

See more detail in [results](https://github.com/SaltyAom/bun-http-framework-benchmark/tree/main/results)

## Notice

I highly recommended testing this benchmark on your machine yourself as performance in likely to vary between machine.

If you are unable to run Deno, please run each Deno app individually first until the Deno finish installing the package, then proceed to run benchmark using `bench.sh` or `npm run benchmark`
