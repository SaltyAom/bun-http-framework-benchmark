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
| uws               | node    | 266,478.303 | 423,880.22 | 406,398.78 |  235,199.8 |   434.41 |      2.3 KB |  21.3 ms |     70.9 / 140.6 MB |
| elysia            | bun     | 212,100.468 |  407,473.7 | 226,577.08 | 212,812.98 | 1,538.11 |    183.1 KB |  16.0 ms |      37.4 / 43.2 MB |
| elysia-aot        | bun     | 210,691.263 | 401,955.19 | 226,790.45 | 212,464.12 | 1,555.29 |    120.3 KB |  19.1 ms |      36.5 / 47.8 MB |
| bun               | bun     |  174,419.23 | 233,907.65 |  251,287.1 | 210,959.31 | 1,522.86 |      2.3 KB |  14.2 ms |      26.7 / 37.8 MB |
| h3                | bun     | 173,449.213 | 267,637.51 | 224,345.05 | 200,242.89 |  1,571.4 |     31.1 KB |   7.3 ms |      33.7 / 45.4 MB |
| hono              | bun     | 168,302.713 | 271,630.56 | 218,317.78 | 181,695.68 | 1,566.83 |     20.5 KB |   6.4 ms |      33.9 / 51.3 MB |
| ultimate-express  | node    | 168,215.955 | 418,957.62 | 117,678.99 | 135,770.81 |    456.4 |    584.5 KB |  60.5 ms |    107.0 / 239.6 MB |
| hono              | deno    |  166,615.65 | 270,070.78 | 195,772.91 |  200,202.7 |   416.21 |         n/a |  37.8 ms |      66.6 / 99.4 MB |
| deno              | deno    | 166,583.135 | 236,109.99 | 202,203.33 |  227,595.9 |   423.32 |         n/a |  14.8 ms |      58.5 / 89.9 MB |
| bun-web-standard  | bun     | 160,808.585 | 231,756.74 | 197,817.85 | 212,134.22 | 1,525.53 |      1.7 KB |   4.7 ms |      27.0 / 41.0 MB |
| deno-web-standard | deno    |  160,299.16 | 227,331.68 | 179,157.61 | 234,290.33 |   417.02 |         n/a |  16.5 ms |      58.9 / 88.6 MB |
| hyper-express     | node    |  137,407.78 | 218,724.61 |  184,196.2 | 146,337.39 |   372.92 |    247.2 KB |  46.3 ms |     77.5 / 188.6 MB |
| h3                | deno    | 129,773.123 | 200,514.43 | 151,072.28 | 167,088.38 |    417.4 |         n/a |  28.7 ms |      74.0 / 96.3 MB |
| fastify           | bun     | 125,026.418 | 189,456.58 | 172,653.32 | 137,698.95 |   296.82 |    574.3 KB |  76.5 ms |     73.5 / 242.2 MB |
| effect            | bun     | 115,801.143 | 197,360.01 | 160,550.28 | 103,713.07 | 1,581.21 |    241.4 KB |  39.9 ms |      49.4 / 75.6 MB |
| fastify           | node    | 103,214.878 | 150,198.95 | 143,172.82 | 119,137.91 |   349.83 |    574.2 KB | 101.1 ms |     99.9 / 206.0 MB |
| h3                | node    |  98,634.498 | 149,297.73 | 129,785.33 | 115,108.31 |   346.62 |     51.2 KB |  38.6 ms |     84.6 / 194.2 MB |
| elysia            | node    |   97,212.19 | 146,854.06 | 134,406.93 |  107,216.4 |   371.37 |    210.3 KB |  42.4 ms |     87.0 / 213.1 MB |
| elysia-aot        | node    |  95,955.058 | 143,432.59 | 134,526.16 | 105,486.91 |   374.57 |    140.0 KB |  59.8 ms |     86.9 / 157.2 MB |
| hono              | node    |  92,002.783 | 143,860.23 | 119,462.89 | 104,461.19 |   226.82 |     52.0 KB |  38.0 ms |     96.9 / 214.4 MB |
| effect            | node    |  84,345.538 | 137,610.44 | 114,283.31 |  85,135.38 |   353.02 |    325.9 KB |  79.6 ms |     94.3 / 184.8 MB |
| express           | bun     |  62,515.322 |  94,852.51 |  87,366.62 |  67,546.36 |    295.8 |    836.2 KB |  47.2 ms |     64.9 / 191.9 MB |
| koa               | node    |   42,720.14 |  65,687.37 |   57,001.3 |  47,862.31 |   329.58 |    730.6 KB |  68.3 ms |     96.9 / 194.4 MB |
| express           | node    |   41,920.29 |  64,250.68 |  57,295.04 |  45,790.73 |   344.71 |    616.3 KB |  50.8 ms |     87.4 / 213.0 MB |
| adonis            | node    |  37,388.928 |  51,742.69 |  47,104.02 |   50,381.9 |    327.1 |      1.2 MB | 205.5 ms |    124.0 / 183.6 MB |
| nest              | node    |  32,285.335 |  48,942.85 |  44,488.56 |  35,377.85 |   332.08 |      1.2 MB |  96.4 ms |    124.6 / 193.0 MB |
| oak               | deno    |  24,109.475 |  35,121.79 |  34,436.45 |  26,634.79 |   244.87 |         n/a |  76.2 ms |    103.0 / 195.4 MB |
| acorn             | deno    |  10,141.623 |  12,860.77 |   13,543.3 |  13,893.62 |    268.8 |         n/a | 249.7 ms |    105.3 / 253.7 MB |

#### Note
1. uws, hyperexpress and ultimate-express bundle size is not accurate because uwebsocket is a native binary that can't be compiled to single bundle, and bundle size is vary based on operating system and CPU architecture
2. uws is a C++ framework with JavaScript binding

See more detail in [results](https://github.com/SaltyAom/bun-http-framework-benchmark/tree/main/results)

## Notice

I highly recommended testing this benchmark on your machine yourself as performance in likely to vary between machine.

If you are unable to run Deno, please run each Deno app individually first until the Deno finish installing the package, then proceed to run benchmark using `bench.sh` or `npm run benchmark`
