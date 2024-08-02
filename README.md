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
-   Windows 11 22H2 build 22631.3527
-   Debian GNU/Linux 11 (Bullseye), kernel: 5.15.146.1-microsoft-standard-WSL2
-   Bun 1.1.21
-   Node 22.4.1
-   Deno 1.45.5

Tested on 2 Aug 2024 20:51 (GMT+7)

## Results

These results are measured in req/s:

| Framework        | Runtime | Average     | Ping       | Query      | Body       |
| ---------------- | ------- | ----------- | ---------- | ---------- | ---------- |
| uws              | node    | 470,283.033 | 579,241.34 | 540,931.67 | 290,676.09 |
| bun              | bun     | 303,082.47  | 361,088.16 | 300,257.38 | 247,901.87 |
| byte             | bun     | 284,171.743 | 340,490.06 | 275,638.49 | 236,386.68 |
| vixeny           | bun     | 277,568.127 | 336,707.48 | 271,701.32 | 224,295.58 |
| elysia           | bun     | 275,665.277 | 334,331.85 | 269,568.48 | 223,095.5  |
| hyper-express    | node    | 273,175.393 | 349,533.48 | 273,690.63 | 196,302.07 |
| bun-web-standard | bun     | 254,588.523 | 310,817.98 | 239,556.54 | 213,391.05 |
| nhttp            | bun     | 246,952.23  | 338,598.01 | 228,187.38 | 174,071.3  |
| wobe             | bun     | 234,983.597 | 256,182.35 | 239,943.25 | 208,825.19 |
| hono             | bun     | 208,169.02  | 254,363.26 | 211,471.54 | 158,672.26 |
| nbit             | bun     | 164,299.853 | 240,314.21 | 178,346.8  | 74,238.55  |
| hono             | deno    | 141,059.907 | 183,192.69 | 140,039.87 | 99,947.16  |
| h3               | node    | 109,437.953 | 123,180.18 | 109,246.35 | 95,887.33  |
| oak              | deno    | 69,362.327  | 80,083.16  | 68,659.99  | 59,343.83  |
| fastify          | node    | 59,127.653  | 76,305.7   | 67,472.19  | 33,605.07  |
| acorn            | deno    | 57,628.73   | 70,492.97  | 53,660.26  | 48,732.96  |
| oak              | bun     | 53,758.663  | 58,385.95  | 52,499.68  | 50,390.36  |
| hono             | node    | 51,533.55   | 66,602.43  | 60,854.6   | 27,143.62  |
| koa              | node    | 46,436.243  | 52,077.58  | 48,744.18  | 38,486.97  |
| express          | bun     | 40,121.71   | 46,055.12  | 38,851.63  | 35,458.38  |
| express          | node    | 18,844.29   | 20,300.52  | 18,752.87  | 17,479.48  |

See more detail in [results](https://github.com/SaltyAom/bun-http-framework-benchmark/tree/main/results)

## Notice

I highly recommended testing this benchmark on your machine yourself as performance in likely to vary between machine.
