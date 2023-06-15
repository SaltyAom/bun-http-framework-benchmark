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
-   Bun 0.6.9
-   Node 18.16.0
-   Deno 1.33.2

Tested on 15 Jun 2023 20:23 (GMT+7)

## Results

For results suffix with `-node` means that the framework is run in Node, otherwise is using Bun.

These results are measured in req/s:

| Framework              | Average     | Get (/)    | Params, query & header | Post JSON  |
| ---------------------- | ----------- | ---------- | ---------------------- | ---------- |
| uws (node)             | 354,979.967 | 434,887.47 | 375,152.42             | 254,900.01 |
| stricjs (bun)          | 283,352.77  | 341,116.76 | 262,118.92             | 246,822.63 |
| elysia (bun)           | 281,695.393 | 344,879.07 | 260,006.34             | 240,200.77 |
| vixeny (bun)           | 277,281.427 | 336,567.58 | 261,911.5              | 233,365.2  |
| bun (bun)              | 273,342.26  | 331,482.5  | 240,810.79             | 247,733.49 |
| hono (bun)             | 254,307.443 | 316,768.26 | 229,622.73             | 216,531.34 |
| nhttp (bun)            | 247,909.63  | 307,198.32 | 224,005.82             | 212,524.75 |
| bun-web-standard (bun) | 244,981.28  | 294,602.54 | 216,976.92             | 223,364.38 |
| bun-bakery (bun)       | 241,437.567 | 285,696.6  | 186,688.08             | 251,928.02 |
| hyper-express (node)   | 235,639.807 | 337,965.55 | 266,321.86             | 102,632.01 |
| hyperbun (bun)         | 181,107.37  | 230,935.23 | 175,219.19             | 137,167.69 |
| baojs (bun)            | 179,234.663 | 197,883.89 | 169,441.57             | 170,378.53 |
| nbit (bun)             | 169,393.053 | 190,397.9  | 159,658.38             | 158,122.88 |
| h3 (node)              | 104,458.57  | 125,126.62 | 91,925.31              | 96,323.78  |
| fast (deno)            | 89,270.61   | 105,094.82 | 86,425.92              | 76,291.09  |
| fastify (node)         | 63,859.073  | 76,682.56  | 63,473.25              | 51,421.41  |
| cheetah (deno)         | 55,226.103  | 83,544.9   | 69,747.26              | 12,386.15  |
| oak (deno)             | 42,659.297  | 50,132.51  | 42,989.59              | 34,855.79  |
| abc (deno)             | 41,373.223  | 54,062     | 45,956.68              | 24,100.99  |
| koa (node)             | 39,060.07   | 45,440.38  | 39,911.9               | 31,827.93  |
| express (bun)          | 30,697.74   | 33,876.52  | 30,208.77              | 28,007.93  |
| hapi (node)            | 24,873.017  | 34,857.3   | 14,926.1               | 24,835.65  |
| adonis (node)          | 23,022.177  | 22,388.23  | 21,061.81              | 25,616.49  |
| express (node)         | 16,043.203  | 17,418.86  | 16,949.78              | 13,760.97  |
| nest (node)            | 13,840.973  | 15,620.26  | 14,485.15              | 11,417.51  |
| acorn (deno)           | 3,150.857   | 5,253.93   | 2,365.92               | 1,832.72   |


See more detail in [results](https://github.com/SaltyAom/bun-http-framework-benchmark/tree/main/results)

## Notice

I highly recommended testing this benchmark on your machine yourself as performance in likely to vary between machine.
