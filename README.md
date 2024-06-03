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
-   Bun 1.1.12
-   Node 20.11.1
-   Deno 1.44.0

Tested on 4 June 2024 2:28 (GMT+7)

## Results

These results are measured in req/s:

| Framework        | Runtime | Average     | Ping       | Query      | Body       |
| ---------------- | ------- | ----------- | ---------- | ---------- | ---------- |
| uws              | node    | 351,773.07  | 422,523.7  | 372,251.38 | 260,544.13 |
| bun              | bun     | 267,107.897 | 320,548.12 | 263,830.09 | 216,945.48 |
| vixeny           | bun     | 265,862.777 | 314,079.19 | 269,767.58 | 213,741.56 |
| byte             | bun     | 258,360.98  | 316,357.65 | 249,130.94 | 209,594.35 |
| elysia           | bun     | 253,278.53  | 308,788.41 | 248,174.84 | 202,872.34 |
| hyper-express    | node    | 248,360.777 | 328,673.81 | 253,498.97 | 162,909.55 |
| bun-web-standard | bun     | 230,856.293 | 282,537.96 | 219,890.36 | 190,140.56 |
| nhttp            | bun     | 228,536.113 | 320,212.82 | 207,419.02 | 157,976.5  |
| wobe             | bun     | 214,232.61  | 238,769.35 | 219,109.14 | 184,819.34 |
| hono             | bun     | 184,966.48  | 234,593.57 | 185,108.2  | 135,197.67 |
| baojs            | bun     | 163,787.96  | 197,915.16 | 161,244.85 | 132,203.87 |
| nbit             | bun     | 149,195.737 | 215,065.04 | 160,726.59 | 71,795.58  |
| hono             | deno    | 141,552.487 | 183,317.78 | 143,586.02 | 97,753.66  |
| fast             | deno    | 118,328.863 | 142,813.21 | 117,411.22 | 94,762.16  |
| h3               | node    | 97,607.893  | 117,931.49 | 92,099.71  | 82,792.48  |
| cheetah          | deno    | 81,793.413  | 136,293.18 | 62,547.97  | 46,539.09  |
| fastify          | bun     | 73,298.123  | 94,061.15  | 86,508.04  | 39,325.18  |
| oak              | deno    | 62,187.07   | 73,338.69  | 65,826.08  | 47,396.44  |
| fastify          | node    | 56,692.69   | 75,933.29  | 63,724.57  | 30,420.21  |
| hono             | node    | 42,699.317  | 60,797.19  | 56,645.8   | 10,654.96  |
| koa              | node    | 41,470.603  | 49,098     | 42,009.09  | 33,304.72  |
| express          | bun     | 37,374.243  | 42,267.41  | 36,850.45  | 33,004.87  |
| abc              | deno    | 29,139.54   | 38,822.49  | 35,591.69  | 13,004.44  |
| express          | node    | 16,461.68   | 17,656.74  | 16,615.32  | 15,112.98  |
| acorn            | deno    | 4,722.25    | 7,511.22   | 4,092.42   | 2,563.11   |

See more detail in [results](https://github.com/SaltyAom/bun-http-framework-benchmark/tree/main/results)

## Notice

I highly recommended testing this benchmark on your machine yourself as performance in likely to vary between machine.
