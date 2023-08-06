# Bun HTTP Framework Benchmark

Compare throughput benchmarks from various Bun HTTP framework

Test method: Average throughput

1. Get (/)
    - Request to [GET] `/`
    - Return `hi`
    - Headers must contains text `Content-Type: text/plain`, additional context is acceptable eg. `Content-Type: text/plain; charset=utf-8`
2. Params, query & header
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
3. Post JSON
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
bun run benchmark
```

Dump result will be available at `results/[benchmark-name].txt`

## Benchmark Condition

This benchmark is tested under the following condition:

-   Windows 11 under WSL Debian
-   Intel I7-13700K, DDR5 32GB 5600MHz
-   Windows 11 22H2 build 22621.1778
-   Debian GNU/Linux 11 (Bullseye), kernel: 5.15.90.1-microsoft-standard-WSL2
-   Bun 0.7.2
-   Node 18.16.0
-   Deno 1.36.0

Tested on 6 Aug 2023 20:13 (GMT+7)

## Results

For results suffix with `-node` means that the framework is run in Node, otherwise is using Bun.

These results are measured in req/s:

| Framework              | Average     | Get (/)    | Params, query & header | Post JSON  |
| ---------------------- | ----------- | ---------- | ---------------------- | ---------- |
| uws (node)             | 358,632.04  | 439,454.8  | 378,589.43             | 257,851.89 |
| vixeny (bun)           | 280,935.6   | 341,844.37 | 270,107.78             | 230,854.65 |
| elysia (bun)           | 275,063.507 | 326,868.9  | 261,729.3              | 236,592.32 |
| stricjs (bun)          | 273,963.883 | 301,726.86 | 276,872.85             | 243,291.94 |
| bun (bun)              | 273,634.127 | 322,071.07 | 251,679.46             | 247,151.85 |
| hono (bun)             | 257,532.08  | 320,757.07 | 233,769.22             | 218,069.95 |
| bun-web-standard (bun) | 242,838.703 | 288,692.76 | 226,591.45             | 213,231.9  |
| nhttp (bun)            | 242,108.753 | 298,928.17 | 219,401.72             | 207,996.37 |
| hyper-express (node)   | 242,045.913 | 354,697.63 | 277,109.51             | 94,330.6   |
| hyperbun (bun)         | 180,787.963 | 227,159.99 | 175,474.56             | 139,729.34 |
| baojs (bun)            | 176,580.34  | 194,706.96 | 168,814.25             | 166,219.81 |
| nbit (bun)             | 171,916.58  | 198,890.9  | 164,813.54             | 152,045.3  |
| hono (deno)            | 145,302.613 | 225,462.99 | 124,313.33             | 86,131.52  |
| h3 (node)              | 112,677.263 | 137,556.49 | 101,431.5              | 99,043.8   |
| fast (deno)            | 98,840.02   | 116,623.81 | 98,045.3               | 81,850.95  |
| fastify (node)         | 64,145.95   | 74,631.46  | 66,235.48              | 51,570.91  |
| cheetah (deno)         | 61,385.783  | 92,804.58  | 79,375.24              | 11,977.53  |
| oak (deno)             | 45,843.993  | 53,298.5   | 46,183.94              | 38,049.54  |
| abc (deno)             | 43,906.72   | 55,944.26  | 47,488.12              | 28,287.78  |
| koa (node)             | 38,696.13   | 44,741.88  | 39,790.11              | 31,556.4   |
| express (bun)          | 29,092.987  | 35,135.39  | 30,334.3               | 21,809.27  |
| hapi (node)            | 28,170.763  | 42,780.44  | 15,350.06              | 26,381.79  |
| adonis (node)          | 23,367.073  | 22,673.54  | 21,442.97              | 25,984.71  |
| express (node)         | 16,301.823  | 17,974.35  | 17,090.62              | 13,840.5   |
| hono (node)            | 15,572.583  | 17,747.65  | 16,644.31              | 12,325.79  |
| nest (node)            | 14,978.863  | 16,926.01  | 15,507.62              | 12,502.96  |
| acorn (deno)           | 3,191.577   | 5,186.11   | 2,452.69               | 1,935.93   |

See more detail in [results](https://github.com/SaltyAom/bun-http-framework-benchmark/tree/main/results)

## Notice

I highly recommended testing this benchmark on your machine yourself as performance in likely to vary between machine.
