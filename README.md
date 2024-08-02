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
-   Bun 1.1.18
-   Node 22.4.1
-   Deno 1.44.0

Tested on 16 July 2024 11:14 (GMT+7)

## Results

These results are measured in req/s:

| Framework        | Runtime | Average     | Ping       | Query      | Body       |
| ---------------- | ------- | ----------- | ---------- | ---------- | ---------- |
| uws              | node    | 457,108.397 | 560,261.93 | 524,163.41 | 286,899.85 |
| bun              | bun     | 287,153.18  | 345,267.33 | 278,891.23 | 237,300.98 |
| vixeny           | bun     | 285,798.593 | 337,724.57 | 287,020.9  | 232,650.31 |
| byte             | bun     | 280,041.583 | 339,757.53 | 272,628.46 | 227,738.76 |
| hyper-express    | node    | 275,027.457 | 351,441.91 | 273,104.66 | 200,535.8  |
| elysia           | bun     | 271,072.993 | 330,671.73 | 262,401.85 | 220,145.4  |
| bun-web-standard | bun     | 248,093.73  | 301,400.99 | 238,761.31 | 204,118.89 |
| nhttp            | bun     | 245,619.027 | 339,342.96 | 223,513.48 | 174,000.64 |
| wobe             | bun     | 227,374.917 | 247,674.59 | 235,851.07 | 198,599.09 |
| hono             | bun     | 198,578.43  | 245,158.57 | 204,425.2  | 146,151.52 |
| baojs            | bun     | 174,183.45  | 216,799.79 | 174,542.86 | 131,207.7  |
| nbit             | bun     | 162,650.04  | 240,316.94 | 173,709.56 | 73,923.62  |
| hono             | deno    | 151,109.15  | 193,143.55 | 154,666.48 | 105,517.42 |
| fast             | deno    | 117,456.103 | 144,087.44 | 113,782.06 | 94,498.81  |
| h3               | node    | 111,333.8   | 126,575.46 | 109,852.26 | 97,573.68  |
| cheetah          | deno    | 86,516.467  | 145,883.03 | 66,129.69  | 47,536.68  |
| oak              | deno    | 64,835.26   | 76,599.5   | 68,865.23  | 49,041.05  |
| fastify          | node    | 59,014.113  | 76,388.04  | 67,123.48  | 33,530.82  |
| hono             | node    | 49,498.503  | 63,566.54  | 57,367.56  | 27,561.41  |
| koa              | node    | 45,479.05   | 50,882.16  | 47,905.4   | 37,649.59  |
| express          | bun     | 38,867.8    | 44,042.88  | 38,234.53  | 34,325.99  |
| abc              | deno    | 30,297.68   | 40,686.47  | 36,881.04  | 13,325.53  |
| express          | node    | 19,164.657  | 20,401.68  | 19,484.3   | 17,607.99  |
| acorn            | deno    | 4,596.567   | 7,669.39   | 3,472.84   | 2,647.47   |

See more detail in [results](https://github.com/SaltyAom/bun-http-framework-benchmark/tree/main/results)

## Notice

I highly recommended testing this benchmark on your machine yourself as performance in likely to vary between machine.
