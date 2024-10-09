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

-   Intel I7-13700K, DDR5 32GB 5600MHz
-   Arch Linux 6.10.8-arch1-1 (btw I use Arch)
-   Bun 1.1.28
-   Node 22.8.0
-   Deno 1.46.3

Tested on 5 Oct 2024 00:09 (GMT+7)

## Results

These results are measured in req/s:

|  Framework       | Runtime | Average | Ping       | Query      | Body       |
| ---------------- | ------- | ------- | ---------- | ---------- | ---------- |
| uws | node | 528,600.203 | 540,863.79 | 511,467.69 | 533,469.13 |
| bun | bun | 422,380.827 | 539,164.55 | 329,423.51 | 398,554.42 |
| elysia | bun | 402,576.443 | 536,252.88 | 310,850.07 | 360,626.38 |
| vixeny | bun | 356,458.887 | 384,447.52 | 320,706.97 | 364,222.17 |
| hyper-express | node | 317,024.547 | 372,643.53 | 299,781.12 | 278,648.99 |
| bun-web-standard | bun | 310,909.727 | 348,138.02 | 263,086.07 | 321,505.09 |
| wobe | bun | 308,145.653 | 296,163.48 | 285,541.06 | 342,732.42 |
| nhttp | bun | 290,208.74 | 382,956 | 251,520.3 | 236,149.92 |
| hono | bun | 257,335.72 | 301,076.07 | 237,439.72 | 233,491.37 |
| nbit | bun | 238,586.12 | 261,229.05 | 206,703.82 | 247,825.49 |
| ultimate-express | node | 235,917.933 | 251,403.53 | 240,376.32 | 215,973.95 |
| hono | deno | 206,112.51 | 255,721.44 | 200,704.78 | 161,911.31 |
| deno | deno | 204,849.877 | 235,716.37 | 183,860.21 | 194,973.05 |
| fastify | node | 141,846.197 | 154,097.32 | 146,490.83 | 124,950.44 |
| hono | node | 128,309.16 | 143,079.27 | 132,622.81 | 109,225.4 |
| oak | bun | 125,102.493 | 124,181.55 | 112,918.83 | 138,207.1 |
| express | bun | 121,921.067 | 134,349.65 | 116,502.96 | 114,910.59 |
| h3 | bun | 118,430.083 | 145,193.38 | 113,462.89 | 96,633.98 |
| koa | node | 102,413.37 | 110,439.26 | 102,434.37 | 94,366.48 |
| oak | deno | 100,205.853 | 104,441.5 | 94,205.66 | 101,970.4 |
| h3 | node | 98,796.757 | 132,401.05 | 111,952.54 | 52,036.68 |
| acorn | deno | 64,874.713 | 94,411.16 | 72,545.02 | 27,667.96 |
| express | node | 29,443.99 | 30,478.92 | 29,525.24 | 28,327.81 |

See more detail in [results](https://github.com/SaltyAom/bun-http-framework-benchmark/tree/main/results)

## Notice

I highly recommended testing this benchmark on your machine yourself as performance in likely to vary between machine.
