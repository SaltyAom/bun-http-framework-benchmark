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
- Bun 1.3.14
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
| uws               | node    |  262,189.28 | 418,899.53 | 402,887.67 | 226,549.36 |   420.56 |      3.0 KB |  50.8 ms |     69.0 / 110.6 MB |
| elysia            | bun     | 213,345.068 | 414,094.18 | 227,491.93 | 210,110.25 | 1,683.91 |    160.8 KB |  50.9 ms |      51.8 / 55.9 MB |
| elysia-aot        | bun     | 211,701.308 | 412,258.51 | 226,878.85 | 205,961.06 | 1,706.81 |    113.8 KB |  52.3 ms |      50.2 / 57.8 MB |
| hono              | deno    |   170,688.4 | 273,297.01 | 199,595.89 |  209,441.4 |    419.3 |         n/a |  66.3 ms |      63.9 / 98.6 MB |
| ultimate-express  | node    | 165,766.333 |    415,000 | 114,906.68 | 132,728.98 |   429.67 |    582.1 KB | 101.9 ms |    102.8 / 238.9 MB |
| deno              | deno    | 164,847.865 | 229,086.58 | 203,806.41 | 226,079.79 |   418.68 |         n/a |  54.5 ms |      56.7 / 87.6 MB |
| bun               | bun     | 163,200.173 | 224,418.64 | 228,185.97 |  198,513.4 | 1,682.68 |      2.3 KB |  54.4 ms |      42.8 / 61.0 MB |
| deno-web-standard | deno    | 160,386.495 | 225,414.36 | 176,008.68 | 239,704.43 |   418.51 |         n/a |  52.5 ms |      57.0 / 86.9 MB |
| bun-web-standard  | bun     | 149,667.245 | 220,295.19 | 172,175.65 | 204,472.57 | 1,725.57 |      1.7 KB |  53.0 ms |      42.8 / 62.4 MB |
| h3                | bun     | 146,074.243 | 219,333.27 | 193,494.61 | 171,185.25 |   283.84 |     30.7 KB |  53.7 ms |     69.9 / 108.6 MB |
| hyper-express     | node    |  137,369.63 | 224,736.41 | 180,118.49 | 144,258.19 |   365.43 |    247.7 KB | 105.2 ms |     76.3 / 195.5 MB |
| hono              | bun     | 131,737.548 |  220,288.2 | 156,148.79 | 148,850.41 | 1,662.79 |     21.4 KB |  58.9 ms |      49.1 / 95.4 MB |
| fastify           | node    |  99,515.833 | 151,039.92 | 143,594.84 | 103,081.52 |   347.05 |    553.4 KB | 111.7 ms |     98.1 / 149.4 MB |
| elysia-aot        | node    |   92,916.39 | 144,383.48 | 119,788.58 | 107,272.96 |   220.54 |    141.6 KB |  54.3 ms |     91.3 / 177.8 MB |
| h3                | node    |  91,563.222 |  136,720.2 | 122,656.36 | 106,520.04 |   356.29 |    103.2 KB | 109.5 ms |     87.4 / 196.1 MB |
| elysia            | node    |  89,346.565 | 138,864.92 | 111,980.79 | 106,318.04 |   222.51 |    192.1 KB |  53.2 ms |     91.6 / 179.3 MB |
| hono              | node    |  88,150.748 | 142,252.07 | 113,673.81 |  96,449.87 |   227.24 |     61.4 KB |  55.8 ms |     98.0 / 212.2 MB |
| effect            | bun     |  83,398.453 |  132,520.9 | 112,731.42 |  86,763.04 | 1,578.45 |    265.0 KB |  64.8 ms |     64.5 / 151.5 MB |
| effect            | node    |  60,553.898 |  96,268.68 |  81,348.19 |  64,239.62 |    359.1 |    357.9 KB | 111.5 ms |     90.4 / 160.2 MB |
| express           | bun     |   54,617.83 |  85,652.39 |  77,140.49 |  55,361.88 |   316.56 |    821.9 KB |  53.1 ms |     80.8 / 235.8 MB |
| koa               | node    |  43,711.553 |  67,718.91 |  61,068.95 |  45,722.26 |   336.09 |    728.7 KB | 118.4 ms |     95.6 / 196.5 MB |
| express           | node    |  41,684.513 |  66,657.15 |  57,113.98 |  42,624.28 |   342.64 |    602.8 KB | 119.5 ms |     86.9 / 223.0 MB |
| adonis            | node    |   37,323.12 |  51,257.67 |  46,912.64 |  50,792.56 |   329.61 |      1.2 MB | 232.0 ms |    122.3 / 205.5 MB |
| nest              | node    |   30,945.88 |  47,751.59 |  41,949.24 |  33,747.63 |   335.06 |      1.3 MB | 170.5 ms |    119.3 / 221.9 MB |
| oak               | deno    |  24,604.223 |  36,056.84 |  35,358.75 |  26,757.67 |   243.63 |         n/a | 113.2 ms |    101.0 / 194.1 MB |
| acorn             | deno    |  10,222.243 |  13,103.59 |  13,661.06 |  13,857.43 |   266.89 |         n/a | 213.9 ms |    103.3 / 237.9 MB |

#### Note
1. uws, hyperexpress and ultimate-express bundle size is not accurate because uwebsocket is a native binary that can't be compiled to single bundle, and bundle size is vary based on operating system and CPU architecture
2. uws is a C++ framework with JavaScript binding

See more detail in [results](https://github.com/SaltyAom/bun-http-framework-benchmark/tree/main/results)

## Notice

I highly recommended testing this benchmark on your machine yourself as performance in likely to vary between machine.

If you are unable to run Deno, please run each Deno app individually first until the Deno finish installing the package, then proceed to run benchmark using `bench.sh` or `npm run benchmark`
