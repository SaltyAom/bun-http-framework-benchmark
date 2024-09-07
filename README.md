# Bun HTTP Framework Benchmark

Compare throughput benchmarks from various JavaScript HTTP framework

Test method: Average throughput

1. Ping
    - Request to [GET] `/`
    - Return `hi`
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

## requirement

-   The framework must at-least has latest published in less than 9 month otherwise will be classified as unmaintained and removed unless is an industry standard (Express).

# Prerequistes

-   [bombardier](https://github.com/codesenberg/bombardier)
-   Nodejs
-   Deno
-   Bun

# Run Test

```typescript
bun benchmark
```

Dump result will be available at `results/[benchmark-name].txt`

## Benchmark Condition

This benchmark is tested under the following condition:

-   Windows 11 under WSL Debian
-   Intel I7-13700K, DDR5 32GB 5600MHz
-   Arch Linux 6.10.8-arch1-1 (btw I use Arch)
-   Bun 1.1.27
-   Node 22.8.0
-   Deno 1.46.3

Tested on 8 Sep 2024 05:01 (GMT+7)

## Results

These results are measured in req/s:

|  Framework       | Runtime | Average | Ping       | Query      | Body       |
| ---------------- | ------- | ------- | ---------- | ---------- | ---------- |
| uws | node | 527,699.817 | 541,728.16 | 506,782.5 | 534,588.79 |
| bun | bun | 376,420.943 | 392,717.69 | 328,330.58 | 408,214.56 |
| vixeny | bun | 356,834.84 | 385,534.29 | 319,145.22 | 365,825.01 |
| elysia | bun | 352,250.317 | 383,595.46 | 310,593.51 | 362,561.98 |
| hyper-express | node | 319,107.997 | 374,450.68 | 302,821.11 | 280,052.2 |
| bun-web-standard | bun | 313,198.2 | 346,600.11 | 266,327.5 | 326,666.99 |
| wobe | bun | 311,801.343 | 299,285.73 | 286,038.98 | 350,079.32 |
| byte | bun | 303,735.947 | 375,423.2 | 313,890.35 | 221,894.29 |
| nhttp | bun | 291,237.093 | 386,127.8 | 254,391.47 | 233,192.01 |
| hono | bun | 259,255.42 | 301,659.93 | 241,603.06 | 234,503.27 |
| nbit | bun | 238,980.92 | 262,030.93 | 205,738.83 | 249,173 |
| hono | deno | 204,461.127 | 248,811.96 | 201,761.33 | 162,810.09 |
| fastify | node | 142,272.007 | 156,478.26 | 145,993.88 | 124,343.88 |
| hono | node | 127,262.563 | 141,586.05 | 132,756.96 | 107,444.68 |
| oak | bun | 123,337.233 | 121,435.6 | 111,719.25 | 136,856.85 |
| express | bun | 121,354.08 | 134,906.43 | 114,388.25 | 114,767.56 |
| koa | node | 104,732.993 | 115,311.99 | 103,595.26 | 95,291.73 |
| oak | deno | 103,133.703 | 108,901.06 | 97,124.66 | 103,375.39 |
| h3 | node | 100,166.14 | 131,867.22 | 115,211.96 | 53,419.24 |
| acorn | deno | 64,043.277 | 93,953.65 | 70,454.11 | 27,722.07 |
| express | node | 29,512.103 | 31,004.1 | 28,612.88 | 28,919.33 |

See more detail in [results](https://github.com/SaltyAom/bun-http-framework-benchmark/tree/main/results)

## Notice

I highly recommended testing this benchmark on your machine yourself as performance in likely to vary between machine.
