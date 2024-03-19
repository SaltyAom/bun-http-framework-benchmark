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
-   Bun 1.0.31
-   Node 20.11.1
-   Deno 1.41.1

Tested on 18 Mar 2024 19:30 (GMT+7)

## Results

These results are measured in req/s:

| Framework        | Runtime | Average     | Ping       | Query      | Body       |
| ---------------- | ------- | ----------- | ---------- | ---------- | ---------- |
| uws              | node    | 343,670.707 | 408,754.11 | 357,707.49 | 264,550.52 |
| stricjs          | bun     | 263,458.723 | 310,449.69 | 263,517.46 | 216,409.02 |
| vixeny           | bun     | 262,700.483 | 307,200.4  | 265,037.5  | 215,863.55 |
| bun              | bun     | 256,231.937 | 311,855.06 | 237,327.53 | 219,513.22 |
| elysia           | bun     | 253,834.873 | 311,629.05 | 242,513.91 | 207,361.66 |
| byte             | bun     | 251,348.463 | 293,340.75 | 247,646.17 | 213,058.47 |
| hyper-express    | node    | 249,655.923 | 319,331.38 | 245,948.08 | 183,688.31 |
| bun-web-standard | bun     | 226,588.567 | 273,801.2  | 212,352.45 | 193,612.05 |
| nhttp            | bun     | 225,984.587 | 303,277.83 | 201,504.06 | 173,171.87 |
| hono             | bun     | 195,717.62  | 225,822.41 | 195,281.81 | 166,048.64 |
| nbit             | bun     | 157,951     | 206,681.64 | 150,754.2  | 116,417.16 |
| baojs            | bun     | 156,059.497 | 185,443.59 | 152,573.77 | 130,161.13 |
| hono             | deno    | 133,301.103 | 169,010.68 | 138,689.48 | 92,203.15  |
| h3               | node    | 94,097.067  | 110,294.43 | 88,397.99  | 83,598.78  |
| fast             | deno    | 93,441.793  | 112,376.39 | 94,677.95  | 73,271.04  |
| cheetah          | deno    | 74,576.827  | 127,421.66 | 55,985.6   | 40,323.22  |
| fastify          | bun     | 66,173.163  | 91,555.33  | 81,144.98  | 25,819.18  |
| fastify          | node    | 58,836.453  | 67,982.54  | 62,557.42  | 45,969.4   |
| oak              | deno    | 48,296.37   | 57,127.28  | 50,419.38  | 37,342.45  |
| koa              | node    | 38,867.127  | 46,519.62  | 39,908.21  | 30,173.55  |
| hono             | node    | 34,811.84   | 49,160.86  | 45,531.72  | 9,742.94   |
| express          | bun     | 31,024.043  | 39,981.39  | 36,260.74  | 16,830     |
| abc              | deno    | 27,327.177  | 38,548     | 31,369.43  | 12,064.1   |
| express          | node    | 15,191.633  | 16,813.43  | 16,167.64  | 12,593.83  |
| acorn            | deno    | 3,209.767   | 5,356.16   | 2,417.12   | 1,856.02   | ⏎   |

See more detail in [results](https://github.com/SaltyAom/bun-http-framework-benchmark/tree/main/results)

## Notice

I highly recommended testing this benchmark on your machine yourself as performance in likely to vary between machine.
