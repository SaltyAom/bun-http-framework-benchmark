# Bun HTTP Framework Benchmark

Compare throughput benchmarks from various Bun HTTP framework

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
    - For the benchmark, the request body will be sent as: `{ "hello": "world" }`
    - Expected response: `{ "hello": "world" }`
    - Headers must contains text `Content-Type: application/json`, additional context is acceptable eg. `Content-Type: application/json; charset=utf-8`.

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
-   Windows 11 22H2 build 22621.1778
-   Debian GNU/Linux 11 (Bullseye), kernel: 5.15.90.1-microsoft-standard-WSL2
-   Bun 1.0.29
-   Node 18.16.1
-   Deno 1.41.0

Tested on 2 Mar 2024 23:49 (GMT+7)

## Results

For results suffix with `-node` means that the framework is run in Node, otherwise is using Bun.

These results are measured in req/s:

|  Framework       | Runtime | Average | Ping       | Query      | Body       |
| ---------------- | ------- | ------- | ---------- | ---------- | ---------- |
| uws | node | 335,011.873 | 400,710.75 | 357,707.7 | 246,617.17 |
| stricjs | bun | 269,815.593 | 320,001.06 | 266,980.55 | 222,465.17 |
| vixeny | bun | 266,034.63 | 312,403.56 | 267,541.45 | 218,158.88 |
| bun | bun | 262,660.433 | 326,375.76 | 237,083.18 | 224,522.36 |
| elysia | bun | 255,574.717 | 313,073.64 | 241,891.57 | 211,758.94 |
| hyper-express | node | 234,395.837 | 311,775.43 | 249,675 | 141,737.08 |
| bun-web-standard | bun | 229,506.653 | 276,411.99 | 215,803.37 | 196,304.6 |
| nhttp | bun | 228,017.227 | 312,841.45 | 198,300.73 | 172,909.5 |
| hono | bun | 203,937.883 | 239,229.82 | 201,663.43 | 170,920.4 |
| nbit | bun | 161,332.27 | 210,751.66 | 152,812.1 | 120,433.05 |
| baojs | bun | 153,938.043 | 185,162.79 | 150,656.04 | 125,995.3 |
| hono | deno | 127,174.177 | 164,130.9 | 132,123.6 | 85,268.03 |
| h3 | node | 96,515.027 | 114,971.87 | 87,935.94 | 86,637.27 |
| fast | deno | 87,525.87 | 104,838.78 | 87,634.84 | 70,103.99 |
| cheetah | deno | 66,465.137 | 124,592.16 | 56,008.57 | 18,794.68 |
| fastify | bun | 65,897.043 | 92,856.71 | 81,604.66 | 23,229.76 |
| fastify | node | 60,322.413 | 71,150.57 | 62,060.26 | 47,756.41 |
| oak | deno | 46,569.853 | 55,174.24 | 48,260.36 | 36,274.96 |
| abc | deno | 41,890.447 | 54,179.86 | 45,272.63 | 26,218.85 |
| koa | node | 39,594.14 | 46,219.64 | 40,961.72 | 31,601.06 |
| express | bun | 29,715.537 | 39,455.46 | 34,700.85 | 14,990.3 |
| hono | node | 29,036.84 | 40,898.41 | 36,822.52 | 9,389.59 |
| express | node | 15,913.153 | 17,736.92 | 17,128.7 | 12,873.84 |
| acorn | deno | 3,225.817 | 5,339.76 | 2,477.49 | 1,860.2 |

Crash:
- express (bun)
- cheetah (deno)

See more detail in [results](https://github.com/SaltyAom/bun-http-framework-benchmark/tree/main/results)

## Notice

I highly recommended testing this benchmark on your machine yourself as performance in likely to vary between machine.
