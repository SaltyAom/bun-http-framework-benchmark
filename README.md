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
| uws | node | 528,684.53 | 536,296.26 | 509,781.41 | 539,975.92 |
| bun | bun | 426,285.053 | 541,510.17 | 331,586.31 | 405,758.68 |
| elysia | bun | 406,326.537 | 545,894.48 | 310,270.41 | 362,814.72 |
| vixeny | bun | 354,580.23 | 381,762.05 | 314,406.56 | 367,572.08 |
| hyper-express | node | 317,704.793 | 371,038.78 | 301,766.56 | 280,309.04 |
| bun-web-standard | bun | 314,410.07 | 347,743.33 | 267,826.28 | 327,660.6 |
| wobe | bun | 312,452.617 | 300,366.34 | 289,926.1 | 347,065.41 |
| nhttp | bun | 290,448.297 | 384,062.91 | 254,244.8 | 233,037.18 |
| hono | bun | 259,099.337 | 304,903.55 | 236,445.31 | 235,949.15 |
| nbit | bun | 238,633.17 | 260,697.47 | 205,658.76 | 249,543.28 |
| ultimate-express | node | 231,722.167 | 250,621.6 | 227,913.38 | 216,631.52 |
| hono | deno | 207,349.25 | 257,259.12 | 201,391.88 | 163,396.75 |
| fastify | node | 141,333.26 | 154,062.24 | 146,389.2 | 123,548.34 |
| hono | node | 125,582.653 | 140,759.1 | 129,002.21 | 106,986.65 |
| oak | bun | 124,979.077 | 122,740.6 | 114,019.91 | 138,176.72 |
| express | bun | 122,036.157 | 134,268.59 | 115,736.47 | 116,103.41 |
| h3 | bun | 120,694.673 | 145,834.79 | 117,195.34 | 99,053.89 |
| oak | deno | 102,183.087 | 107,925.73 | 95,539.57 | 103,083.96 |
| koa | node | 101,016.99 | 110,073.21 | 99,761.97 | 93,215.79 |
| h3 | node | 99,490.347 | 132,280.52 | 113,216.61 | 52,973.91 |
| acorn | deno | 62,980.927 | 92,288.31 | 68,977.54 | 27,676.93 |
| express | node | 29,693.997 | 31,018.75 | 29,730.42 | 28,332.82 |

###### Crash: Nitro

See more detail in [results](https://github.com/SaltyAom/bun-http-framework-benchmark/tree/main/results)

## Notice

I highly recommended testing this benchmark on your machine yourself as performance in likely to vary between machine.
