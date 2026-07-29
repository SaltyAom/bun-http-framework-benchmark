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
- Bun 1.4.0-canary.1+e82022145
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
| uws               | node    | 262,146.763 | 418,004.94 | 403,086.14 | 227,077.97 |      418 |      3.0 KB |  51.2 ms |     69.1 / 139.2 MB |
| elysia-aot        | bun     | 210,411.218 | 405,492.53 | 225,472.49 | 209,054.45 |  1,625.4 |    113.8 KB |  51.8 ms |      35.1 / 43.7 MB |
| elysia            | bun     | 209,759.653 | 402,997.65 | 224,698.15 | 209,695.07 | 1,647.74 |    160.8 KB |  51.1 ms |      37.0 / 45.7 MB |
| hono              | deno    | 168,275.568 | 270,863.31 | 192,551.61 | 209,265.93 |   421.42 |         n/a |  65.4 ms |      64.5 / 98.4 MB |
| ultimate-express  | node    | 165,699.173 | 414,726.85 | 112,757.84 | 134,886.28 |   425.72 |    582.6 KB | 101.5 ms |    103.9 / 247.3 MB |
| deno              | deno    |  164,676.94 | 227,891.01 | 201,701.58 | 228,692.16 |   423.01 |         n/a |  56.4 ms |      56.8 / 88.8 MB |
| bun               | bun     |  164,668.13 | 229,744.39 | 225,935.32 | 201,435.56 | 1,557.25 |      2.3 KB |  53.6 ms |      27.4 / 46.4 MB |
| deno-web-standard | deno    | 163,087.993 | 234,138.92 |  177,178.3 | 240,614.39 |   420.36 |         n/a |  56.1 ms |      57.1 / 86.9 MB |
| hono              | bun     |  157,868.98 | 262,902.13 | 189,641.54 |  177,332.1 | 1,600.15 |     21.3 KB |  59.1 ms |      32.4 / 73.9 MB |
| h3                | bun     | 151,575.755 | 228,562.72 | 201,546.53 | 175,914.91 |   278.86 |     30.6 KB |  54.2 ms |      43.3 / 66.4 MB |
| bun-web-standard  | bun     | 148,184.248 | 212,819.02 | 175,698.66 | 202,569.07 | 1,650.24 |      1.7 KB |  53.3 ms |      27.8 / 45.4 MB |
| hyper-express     | node    | 137,683.833 | 222,935.14 | 182,341.75 | 145,082.79 |   375.65 |    247.9 KB |  52.0 ms |     75.8 / 211.2 MB |
| fastify           | node    | 101,360.445 | 151,181.82 |  148,536.7 | 105,369.47 |   353.79 |    554.7 KB | 105.8 ms |     98.5 / 192.4 MB |
| elysia            | node    |  93,845.975 | 145,524.38 |    117,526 | 112,108.83 |   224.69 |    192.1 KB | 111.4 ms |     92.1 / 182.0 MB |
| elysia-aot        | node    |  93,522.755 |  146,216.3 |  118,616.6 | 109,036.93 |   221.19 |    141.6 KB |  53.4 ms |     92.0 / 181.7 MB |
| h3                | node    |   92,327.85 | 136,638.44 | 124,386.27 | 107,949.38 |   337.31 |    103.2 KB |  56.6 ms |     88.4 / 197.9 MB |
| effect            | bun     |   88,936.42 | 143,317.34 | 117,710.89 |  93,215.15 |  1,502.3 |    264.6 KB |  58.1 ms |     47.7 / 104.0 MB |
| hono              | node    |  86,129.318 | 140,752.12 | 111,482.95 |  92,056.27 |   225.93 |     61.3 KB | 120.6 ms |     97.8 / 211.7 MB |
| effect            | node    |  59,958.815 |  95,462.79 |  79,718.36 |  64,284.28 |   369.83 |    357.6 KB | 107.2 ms |     91.3 / 132.3 MB |
| express           | bun     |  56,261.163 |  85,301.36 |  77,560.66 |  61,911.32 |   271.31 |    822.8 KB | 116.5 ms |     60.5 / 150.8 MB |
| koa               | node    |  43,294.172 |  65,713.54 |  60,577.36 |  46,552.49 |    333.3 |    729.6 KB |  54.9 ms |     94.8 / 200.4 MB |
| express           | node    |   42,974.56 |  67,515.69 |  59,386.22 |  44,651.29 |   345.04 |    603.6 KB |  57.9 ms |     86.0 / 206.4 MB |
| adonis            | node    |    36,557.4 |  50,603.45 |  46,701.39 |  48,600.56 |    324.2 |      1.2 MB | 239.0 ms |    123.5 / 160.0 MB |
| nest              | node    |  31,675.738 |  48,055.87 |  42,609.87 |  35,702.96 |   334.25 |      1.3 MB | 106.7 ms |    118.0 / 213.7 MB |
| oak               | deno    |  24,384.597 |  35,571.19 |  35,013.02 |  26,712.18 |      242 |         n/a | 111.5 ms |    101.3 / 195.9 MB |
| acorn             | deno    |  10,264.195 |  13,223.33 |   13,628.8 |  13,929.79 |   274.86 |         n/a | 209.3 ms |    104.2 / 266.7 MB |

#### Note
1. uws, hyperexpress and ultimate-express bundle size is not accurate because uwebsocket is a native binary that can't be compiled to single bundle, and bundle size is vary based on operating system and CPU architecture
2. uws is a C++ framework with JavaScript binding

See more detail in [results](https://github.com/SaltyAom/bun-http-framework-benchmark/tree/main/results)

## Notice

I highly recommended testing this benchmark on your machine yourself as performance in likely to vary between machine.

If you are unable to run Deno, please run each Deno app individually first until the Deno finish installing the package, then proceed to run benchmark using `bench.sh` or `npm run benchmark`
