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
-   Arch Linux 6.10.9-arch1-2 (btw I use Arch)
-   Bun 1.1.30
-   Node 22.8.0
-   Deno 2.0.0

Tested on 10 Oct 2024 02:04 (GMT+7)

## Results

These results are measured in req/s:

|  Framework       | Runtime | Average | Ping       | Query      | Body       |
| ---------------- | ------- | ------- | ---------- | ---------- | ---------- |
| uws | node | 522,827.833 | 534,617.26 | 501,852.04 | 532,014.2 |
| bun | bun | 420,637.837 | 535,794.82 | 332,534.17 | 393,584.52 |
| elysia | bun | 402,500.15 | 537,823.18 | 310,490.05 | 359,187.22 |
| vixeny | bun | 355,799.453 | 388,645.4 | 315,925.07 | 362,827.89 |
| hyper-express | node | 315,922.07 | 369,552.41 | 300,347.16 | 277,866.64 |
| wobe | bun | 312,237.51 | 297,324.2 | 288,859.74 | 350,528.59 |
| bun-web-standard | bun | 306,997.287 | 343,897.06 | 261,194.14 | 315,900.66 |
| nhttp | bun | 290,254.55 | 383,137.72 | 253,369.86 | 234,256.07 |
| hono | bun | 258,790.057 | 301,981.83 | 239,629.52 | 234,758.82 |
| deno | deno | 245,589.31 | 265,765.7 | 232,579.03 | 238,423.2 |
| nbit | bun | 236,476.243 | 260,526.71 | 204,210.92 | 244,691.1 |
| ultimate-express | node | 236,056.59 | 252,259.64 | 238,642.52 | 217,267.61 |
| hono | deno | 204,650.553 | 254,085.18 | 199,150.72 | 160,715.76 |
| deno-web-standard | deno | 204,346.857 | 235,673.11 | 181,753.89 | 195,613.57 |
| fastify | node | 140,703.297 | 154,398.09 | 145,754.27 | 121,957.53 |
| hono | node | 124,492.93 | 137,581.65 | 129,470.13 | 106,427.01 |
| oak | bun | 124,471.613 | 123,234.73 | 113,438.15 | 136,741.96 |
| express | bun | 123,098.917 | 135,516.99 | 118,745.67 | 115,034.09 |
| h3 | bun | 117,410.4 | 144,300.06 | 111,128.23 | 96,802.91 |
| koa | node | 102,251.6 | 113,321.47 | 100,713.2 | 92,720.13 |
| oak | deno | 99,657.137 | 104,906.73 | 93,028.44 | 101,036.24 |
| h3 | node | 96,766.003 | 127,440.46 | 111,172.77 | 51,684.78 |
| acorn | deno | 64,489.25 | 93,958.23 | 71,414.69 | 28,094.83 |
| express | node | 29,761.447 | 30,716.56 | 29,673.78 | 28,894 |

See more detail in [results](https://github.com/SaltyAom/bun-http-framework-benchmark/tree/main/results)

## Notice

I highly recommended testing this benchmark on your machine yourself as performance in likely to vary between machine.

If you are unable to run Deno, please run each Deno app individually first until the Deno finish installing the package, then proceed to run benchmark using `bench.sh` or `npm run benchmark`
