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
-   Bun 0.8.1
-   Node 18.16.0
-   Deno 1.36.0

Tested on 28 Aug 2023 23:57 (GMT+7)

## Results

For results suffix with `-node` means that the framework is run in Node, otherwise is using Bun.

These results are measured in req/s:

| Framework              | Average     | Get (/)    | Params, query & header | Post JSON  |
| ---------------------- | ----------- | ---------- | ---------------------- | ---------- |
| uws (node)             | 347,003.823 | 419,534.71 | 371,312.33             | 250,164.43 |
| stricjs (bun)          | 248,566.523 | 299,242.51 | 243,409.82             | 203,047.24 |
| elysia (bun)           | 242,633.237 | 299,733.44 | 229,471.23             | 198,695.04 |
| vixeny (bun)           | 240,163.17  | 306,089.54 | 225,000.88             | 189,399.09 |
| hono (bun)             | 223,343.487 | 281,201.91 | 212,373.15             | 176,455.4  |
| hyper-express (node)   | 222,213.693 | 330,511.5  | 254,319.76             | 81,809.82  |
| bun-web-standard (bun) | 220,092.243 | 270,285.59 | 204,414.38             | 185,576.76 |
| nhttp (bun)            | 196,037.19  | 263,162.03 | 163,663.63             | 161,285.91 |
| bun (bun)              | 184,380.017 | 310,067.94 | 220,587.34             | 22,484.77  |
| hyperbun (bun)         | 156,983.54  | 210,268.4  | 150,890.16             | 109,792.06 |
| baojs (bun)            | 140,862.84  | 174,622.89 | 134,055.91             | 113,909.72 |
| nbit (bun)             | 137,966.477 | 175,456.56 | 130,061.45             | 108,381.42 |
| hono (deno)            | 116,684.06  | 149,754.69 | 118,365.86             | 81,931.63  |
| h3 (node)              | 106,965.17  | 125,293.99 | 99,521.66              | 96,079.86  |
| fast (deno)            | 89,643.2    | 105,375.3  | 88,499.58              | 75,054.72  |
| fastify (node)         | 60,025.49   | 70,491.81  | 60,932.64              | 48,652.02  |
| oak (deno)             | 44,687.2    | 52,811.6   | 45,351.52              | 35,898.48  |
| abc (deno)             | 41,122.333  | 52,572.89  | 43,690.21              | 27,103.9   |
| koa (node)             | 36,722.723  | 42,754.73  | 36,972.56              | 30,440.88  |
| hapi (node)            | 27,437.86   | 42,171.86  | 15,580.55              | 24,561.17  |
| adonis (node)          | 21,575.047  | 21,730.93  | 20,000.5               | 22,993.71  |
| express (node)         | 15,537.457  | 17,017.97  | 16,177.79              | 13,416.61  |
| hono (node)            | 14,566.477  | 16,556.72  | 15,553.8               | 11,588.91  |
| nest (node)            | 13,752.253  | 14,905.06  | 14,428.09              | 11,923.61  |
| acorn (deno)           | 3,134.723   | 5,206.46   | 2,368.13               | 1,829.58   |

Crash:
| express (bun) | 512,117.39 | 513,848.37 | 511,647.49 | 510,856.31 |
| cheetah (deno) | 300,995.98 | 507,117.96 | 378,810.25 | 17,059.73 |

See more detail in [results](https://github.com/SaltyAom/bun-http-framework-benchmark/tree/main/results)

## Notice

I highly recommended testing this benchmark on your machine yourself as performance in likely to vary between machine.
