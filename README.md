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
uname -a
Linux seia 7.0.11-1-cachyos #1 SMP PREEMPT_DYNAMIC Wed, 03 Jun 2026 22:05:15 +0000 x86_64 GNU/Linux
```

## Results

These results are measured in req/s:

| Framework         | Runtime | Average     | Ping       | Query      | Body       | Video    | Bundle Size | Startup  | Memory Before/After |
| ----------------- | ------- | ----------: | ---------: | ---------: | ---------: | -------: | ----------: | -------: | ------------------: |
| uws               | node    | 263,814.078 | 419,767.46 | 400,014.03 |    235,060 |   414.82 |     3.0 KB* |  50.7 ms |     69.2 / 124.8 MB |
| elysia-aot        | bun     |  209,198.18 | 407,236.33 |  225,062.6 | 202,645.88 | 1,847.91 |    113.8 KB |  51.0 ms |      50.5 / 52.9 MB |
| elysia            | bun     | 209,096.655 |  403,775.3 | 226,264.62 |  204,582.8 |  1,763.9 |    160.8 KB |  50.9 ms |      52.0 / 56.9 MB |
| hono              | deno    | 167,069.195 | 275,498.02 |  192,332.8 | 200,026.46 |    419.5 |         n/a |  65.3 ms |      64.4 / 98.0 MB |
| ultimate-express  | node    |  165,127.85 | 415,336.96 | 112,734.27 | 132,011.35 |   428.82 |   582.1 KB* | 101.3 ms |    103.0 / 240.6 MB |
| deno              | deno    | 162,738.065 | 225,680.79 | 198,146.04 | 226,707.21 |   418.22 |         n/a |  52.9 ms |      57.0 / 89.7 MB |
| bun               | bun     | 160,917.338 | 224,824.01 |  224,445.6 | 192,615.24 |  1,784.5 |      2.3 KB |  54.1 ms |      43.0 / 60.6 MB |
| deno-web-standard | deno    |  157,948.67 | 223,126.72 | 172,365.36 | 235,886.28 |   416.32 |         n/a |  55.2 ms |      57.2 / 88.2 MB |
| bun-web-standard  | bun     |  146,101.37 | 214,670.87 |    170,332 | 197,573.69 | 1,828.92 |      1.7 KB |  53.5 ms |      43.0 / 62.3 MB |
| h3                | bun     | 143,206.417 | 213,378.53 | 189,320.85 | 169,846.56 |   279.73 |     30.7 KB |  53.9 ms |     70.2 / 110.8 MB |
| hyper-express     | node    | 135,189.975 | 214,859.01 | 181,022.07 | 144,509.79 |   369.03 |   247.7 KB* |  51.3 ms |     76.3 / 207.6 MB |
| hono              | bun     | 128,132.995 |  214,363.4 | 149,826.72 | 146,557.21 | 1,784.65 |     21.4 KB |  67.9 ms |      48.7 / 95.3 MB |
| fastify           | node    |  98,837.967 | 150,768.08 | 143,921.75 | 100,310.86 |   351.18 |    553.4 KB | 107.2 ms |     99.6 / 186.1 MB |
| h3                | node    |  93,084.938 | 137,872.73 | 124,904.02 | 109,225.54 |   337.46 |    103.2 KB | 112.4 ms |     87.8 / 186.9 MB |
| elysia-aot        | node    |  92,726.365 | 143,346.36 | 117,954.25 | 109,381.49 |   223.36 |    141.6 KB |  56.0 ms |     91.7 / 178.7 MB |
| elysia            | node    |  89,839.143 | 142,458.75 |  114,109.7 | 102,565.81 |   222.31 |    192.1 KB |  54.0 ms |     92.2 / 181.8 MB |
| hono              | node    |   87,643.64 | 141,376.17 | 113,804.54 |  95,167.15 |    226.7 |     61.4 KB |  55.0 ms |     96.9 / 193.3 MB |
| express           | bun     |   49,049.29 |  75,978.28 |  69,944.32 |  49,969.04 |   305.52 |    821.9 KB | 111.9 ms |     75.9 / 221.7 MB |
| effect            | bun     |  44,570.398 |  71,160.02 |  58,266.72 |  47,213.56 | 1,641.29 |    264.4 KB | 107.6 ms |     64.1 / 164.9 MB |
| koa               | node    |  44,261.065 |  68,688.91 |  60,123.04 |  47,900.11 |    332.2 |    728.7 KB | 118.2 ms |     95.0 / 188.5 MB |
| effect            | node    |  41,303.245 |  65,269.91 |  55,396.06 |  44,196.27 |   350.74 |    357.3 KB | 108.8 ms |     91.3 / 209.2 MB |
| adonis            | node    |  36,688.598 |  50,703.76 |  46,734.65 |  48,992.05 |   323.93 |      1.2 MB | 178.6 ms |    124.5 / 179.9 MB |
| express           | node    |  36,453.125 |  57,314.83 |  49,800.78 |  38,360.41 |   336.48 |    602.7 KB |  54.7 ms |     86.9 / 227.3 MB |
| nest              | node    |  30,969.503 |  47,910.48 |  40,825.12 |  34,810.79 |   331.62 |      1.3 MB | 106.4 ms |    119.3 / 216.3 MB |
| oak               | deno    |  23,304.633 |  34,211.86 |   32,907.1 |  25,861.69 |   237.88 |         n/a | 119.8 ms |    101.3 / 179.5 MB |
| acorn             | deno    |  10,113.923 |  12,961.19 |  13,522.62 |  13,704.29 |   267.59 |         n/a | 181.3 ms |    104.6 / 247.7 MB |

#### Note
1. uws, hyperexpress and ultimate-express bundle size is not accurate because uwebsocket is a native binary that can't be compiled to single bundle, and bundle size is vary based on operating system and CPU architecture

See more detail in [results](https://github.com/SaltyAom/bun-http-framework-benchmark/tree/main/results)

## Notice

I highly recommended testing this benchmark on your machine yourself as performance in likely to vary between machine.

If you are unable to run Deno, please run each Deno app individually first until the Deno finish installing the package, then proceed to run benchmark using `bench.sh` or `npm run benchmark`
