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
-   Bun 1.2.11
-   Node 22.15.0
-   Deno 2.2.0

Tested on 6 May 2025 20:55 (GMT+7)

## Results

These results are measured in req/s:

|  Framework       | Runtime | Average | Ping       | Query      | Body       |
| ---------------- | ------- | ------- | ---------- | ---------- | ---------- |
| uws | node | 526,295.397 | 535,079.45 | 509,759.27 | 534,047.47 |
| ultimate-express | node | 416,645.31 | 526,907.98 | 508,436.34 | 214,591.61 |
| elysia | bun | 397,259.163 | 533,560.05 | 300,716.41 | 357,501.03 |
| bun | bun | 366,716.193 | 386,961.93 | 317,958.96 | 395,227.69 |
| hyper-express | node | 315,844.147 | 370,809.65 | 299,522.59 | 277,200.2 |
| bun-web-standard | bun | 303,568.81 | 338,462.84 | 255,297.65 | 316,945.94 |
| nhttp | bun | 283,734.777 | 373,377.37 | 244,767.65 | 233,059.31 |               | wobe | bun | 282,858.987 | 282,509.03 | 250,687.47 | 315,380.46 |
| hono | bun | 253,646.173 | 294,945.14 | 236,066.25 | 229,927.13 |
| deno | deno | 247,770.227 | 269,520.16 | 233,460.27 | 240,330.25 |
| nbit | bun | 229,226.153 | 252,902.81 | 196,843.1 | 237,932.55 |
| deno-web-standard | deno | 204,908.633 | 236,235.96 | 183,458.05 | 195,031.89 |
| hono | deno | 201,548.523 | 250,592.98 | 195,744.04 | 158,308.55 |
| fastify | node | 142,695.487 | 155,142.07 | 148,078.23 | 124,866.16 |
| hono | node | 129,234.593 | 144,842.92 | 134,412.44 | 108,448.42 |
| express | bun | 126,674.41 | 145,427.54 | 134,805.54 | 99,790.15 |
| oak | bun | 120,481.7 | 117,743.45 | 109,295.56 | 134,406.09 |
| h3 | bun | 109,739.16 | 132,720.75 | 104,854.13 | 91,642.6 |
| h3 | node | 101,237.803 | 136,023.12 | 111,361.83 | 56,328.46 |
| oak | deno | 100,205.983 | 105,824.67 | 93,335 | 101,458.28 |                    | koa | node | 96,456.887 | 103,217.62 | 97,582.12 | 88,570.92 |
| acorn | deno | 64,951.337 | 95,734.91 | 71,099.63 | 28,019.47 |
| express | node | 25,079.01 | 26,286.22 | 24,796.49 | 24,154.32 |

See more detail in [results](https://github.com/SaltyAom/bun-http-framework-benchmark/tree/main/results)

## Notice

I highly recommended testing this benchmark on your machine yourself as performance in likely to vary between machine.

If you are unable to run Deno, please run each Deno app individually first until the Deno finish installing the package, then proceed to run benchmark using `bench.sh` or `npm run benchmark`
