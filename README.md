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
-   Bun 1.1.18
-   Node 22.4.1
-   Deno 1.44.0

Tested on 13 July 2024 12:07 (GMT+7)

## Results

These results are measured in req/s:

| Framework        | Runtime | Average     | Ping       | Query      | Body       |
| ---------------- | ------- | ----------- | ---------- | ---------- | ---------- |
| uws              | node    | 436,032.387 | 548,449.5  | 487,893.71 | 271,753.95 |
| bun              | bun     | 270,383.973 | 323,939.69 | 266,135.36 | 221,076.87 |
| vixeny           | bun     | 267,578.063 | 317,763.34 | 269,977.73 | 214,993.12 |
| byte             | bun     | 263,197.157 | 320,505.3  | 256,739.15 | 212,347.02 |
| hyper-express    | node    | 258,398.497 | 333,213.78 | 258,430.72 | 183,550.99 |
| elysia           | bun     | 252,072.18  | 307,844.07 | 249,426.15 | 198,946.32 |
| bun-web-standard | bun     | 230,200.767 | 278,672.78 | 219,060.43 | 192,869.09 |
| nhttp            | bun     | 227,446.787 | 315,588.36 | 205,880.82 | 160,871.18 |
| wobe             | bun     | 216,267.327 | 236,954.81 | 223,596.44 | 188,250.73 |
| hono             | bun     | 191,081.477 | 247,635.14 | 186,993.53 | 138,615.76 |
| baojs            | bun     | 162,221.29  | 198,823.28 | 160,558.74 | 127,281.85 |
| nbit             | bun     | 152,162.987 | 224,462.86 | 160,641.71 | 71,384.39  |
| hono             | deno    | 142,712.117 | 186,816.5  | 142,618.06 | 98,701.79  |
| fast             | deno    | 119,707.843 | 145,157.05 | 118,366.14 | 95,600.34  |
| h3               | node    | 102,050.363 | 115,527.4  | 100,495.11 | 90,128.58  |
| cheetah          | deno    | 82,470.417  | 138,619.42 | 61,226.94  | 47,564.89  |
| oak              | deno    | 63,278.437  | 74,582.26  | 67,035.21  | 48,217.84  |
| fastify          | node    | 53,005.113  | 65,600.33  | 61,849.57  | 31,565.44  |
| hono             | node    | 48,099.543  | 61,790.31  | 57,083.61  | 25,424.71  |
| koa              | node    | 43,014.05   | 50,364.09  | 43,371.12  | 35,306.94  |
| express          | bun     | 36,493.053  | 41,164.55  | 35,937.72  | 32,376.89  |
| abc              | deno    | 29,346.513  | 38,704.8   | 36,272.63  | 13,062.11  |
| express          | node    | 18,207.097  | 19,437.73  | 18,672.87  | 16,510.69  |
| acorn            | deno    | 4,540.683   | 7,692.16   | 3,350.09   | 2,579.8    |

See more detail in [results](https://github.com/SaltyAom/bun-http-framework-benchmark/tree/main/results)

## Notice

I highly recommended testing this benchmark on your machine yourself as performance in likely to vary between machine.
