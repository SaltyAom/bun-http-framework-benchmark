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

Each run updates `results/results.md` and generates `README.md` from
`README.template.md` with the results and `uname -a` output. Edit the template
to change the README. A selected-target run replaces the table with those
targets. If no target produces results, the run preserves `README.md`.

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

```
$ uname -a
Linux seia 7.0.11-1-cachyos #1 SMP PREEMPT_DYNAMIC Wed, 03 Jun 2026 22:05:15 +0000 x86_64 GNU/Linux
```

## Results

These results are measured in req/s:

| Framework         | Runtime | Average     | Ping       | Query      | Body       | Video    | Bundle Size | Startup  | Memory Before/After |
| ----------------- | ------- | ----------: | ---------: | ---------: | ---------: | -------: | ----------: | -------: | ------------------: |
| uws               | node    | 267,311.582 | 427,899.11 | 409,892.79 | 231,035.02 |   419.41 |      2.3 KB |  20.0 ms |     70.8 / 139.9 MB |
| elysia-aot        | bun     |  214,518.67 | 409,673.06 | 234,387.61 | 212,373.44 | 1,640.57 |    136.3 KB |  16.0 ms |      36.3 / 48.7 MB |
| elysia            | bun     | 212,598.372 |  408,136.5 |  226,959.6 |  213,631.8 | 1,665.59 |    186.8 KB |  19.6 ms |      37.3 / 48.4 MB |
| h3                | bun     | 172,978.673 | 268,455.21 | 219,564.22 | 202,299.58 | 1,595.68 |     31.1 KB |   7.3 ms |      33.6 / 50.0 MB |
| bun               | bun     | 172,879.358 |  232,912.2 | 245,937.47 | 210,980.87 | 1,686.89 |      2.3 KB |   4.0 ms |      26.7 / 38.4 MB |
| hono              | bun     |  169,752.09 |  271,679.6 | 221,518.09 | 184,179.03 | 1,631.64 |     19.7 KB |   7.4 ms |      33.5 / 44.3 MB |
| ultimate-express  | node    | 168,817.505 |  424,303.7 | 118,309.22 | 132,197.69 |   459.41 |    583.5 KB |  54.1 ms |    107.0 / 240.8 MB |
| hono              | deno    | 168,727.828 | 273,089.68 | 192,674.87 | 208,728.09 |   418.67 |         n/a |  41.6 ms |      66.2 / 98.6 MB |
| deno              | deno    | 167,972.283 | 237,237.03 | 202,167.34 | 232,064.26 |    420.5 |         n/a |  13.2 ms |      58.5 / 89.2 MB |
| bun-web-standard  | bun     | 162,686.943 | 231,235.21 |  199,156.8 | 218,736.32 | 1,619.44 |      1.7 KB |   3.8 ms |      27.1 / 41.7 MB |
| deno-web-standard | deno    | 161,145.583 | 232,952.03 | 176,955.08 | 234,253.33 |   421.89 |         n/a |  14.4 ms |      58.8 / 86.4 MB |
| hyper-express     | node    | 138,848.412 | 226,731.93 | 181,959.05 | 146,334.69 |   367.98 |    247.2 KB |  39.2 ms |     77.9 / 207.3 MB |
| h3                | deno    | 129,564.015 | 200,966.71 | 149,816.45 | 167,046.48 |   426.42 |         n/a |  29.3 ms |     73.8 / 163.0 MB |
| effect            | bun     | 123,353.122 | 201,211.96 | 164,772.49 | 125,838.59 | 1,589.45 |    221.8 KB |  32.5 ms |      48.8 / 73.6 MB |
| fastify           | bun     | 122,655.538 | 187,286.97 | 171,025.02 | 132,017.52 |   292.64 |    556.8 KB |  76.8 ms |     74.9 / 193.8 MB |
| fastify           | node    | 103,292.998 | 155,273.66 | 143,072.85 | 114,475.25 |   350.23 |    556.8 KB |  69.7 ms |     95.7 / 205.0 MB |
| h3                | node    |  98,758.288 | 149,801.48 | 133,825.29 | 111,055.35 |   351.03 |     50.4 KB |  45.5 ms |     85.3 / 190.1 MB |
| hono              | node    |  93,107.478 | 146,046.63 | 121,489.54 | 104,659.13 |   234.61 |     52.8 KB |  48.9 ms |     97.0 / 220.6 MB |
| elysia-aot        | node    |  92,923.678 | 144,966.13 | 120,779.71 | 105,726.96 |   221.91 |    153.4 KB |  63.0 ms |     91.5 / 182.8 MB |
| elysia            | node    |  92,489.338 | 143,690.09 | 119,227.17 | 106,817.31 |   222.78 |    212.2 KB |  58.6 ms |     93.0 / 181.3 MB |
| effect            | node    |   88,635.68 | 144,825.52 | 119,671.74 |  89,680.71 |   364.75 |    281.7 KB |  53.5 ms |     93.0 / 177.6 MB |
| express           | bun     |  63,217.945 |  95,984.74 |  89,301.15 |  67,289.15 |   296.74 |    836.2 KB |  42.5 ms |     64.9 / 152.4 MB |
| koa               | node    |  44,591.625 |  68,962.39 |  62,198.63 |  46,871.56 |   333.92 |    729.6 KB |  51.7 ms |     96.1 / 192.2 MB |
| express           | node    |  42,293.953 |  64,589.19 |  57,320.85 |  46,922.84 |   342.93 |    616.3 KB |  44.2 ms |     87.2 / 208.8 MB |
| adonis            | node    |  37,642.445 |  52,057.13 |   47,217.1 |  50,969.25 |    326.3 |      1.2 MB | 351.8 ms |    124.4 / 167.8 MB |
| nest              | node    |   31,939.89 |  49,322.92 |  43,493.67 |  34,609.05 |   333.92 |      1.2 MB | 116.5 ms |    118.7 / 224.3 MB |
| oak               | deno    |  24,449.013 |   35,570.6 |  35,004.12 |  26,977.52 |   243.81 |         n/a |  60.2 ms |    103.3 / 195.1 MB |
| acorn             | deno    |   10,078.76 |  13,000.19 |  13,536.68 |  13,512.71 |   265.46 |         n/a |  77.2 ms |    106.4 / 237.5 MB |

#### Note
1. uws, hyperexpress and ultimate-express bundle size is not accurate because uwebsocket is a native binary that can't be compiled to single bundle, and bundle size is vary based on operating system and CPU architecture
2. uws is a C++ framework with JavaScript binding

See more detail in [results](https://github.com/SaltyAom/bun-http-framework-benchmark/tree/main/results)

## Notice

I highly recommended testing this benchmark on your machine yourself as performance in likely to vary between machine.

If you are unable to run Deno, please run each Deno app individually first until the Deno finish installing the package, then proceed to run benchmark using `bench.sh` or `npm run benchmark`
