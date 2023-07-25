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
-   Bun 0.7.0
-   Node 18.16.0
-   Deno 1.33.2

Tested on 25 Jul 2023 11:08 (GMT+7)

## Results

For results suffix with `-node` means that the framework is run in Node, otherwise is using Bun.

These results are measured in req/s:

| Framework              | Average     | Get (/)    | Params, query & header | Post JSON  |
| ---------------------- | ----------- | ---------- | ---------------------- | ---------- |
| uws (node)             | 354,830.13  | 433,462.77 | 377,299.4              | 253,728.22 |
| bun (bun)              | 286,951.06  | 351,339.29 | 255,444.05             | 254,069.84 |
| stricjs (bun)          | 283,870.573 | 349,684.35 | 273,733.04             | 228,194.33 |
| elysia (bun)           | 281,163.69  | 341,291.05 | 260,562.46             | 241,637.56 |
| vixeny (bun)           | 279,859.53  | 337,631.76 | 264,527.14             | 237,419.69 |
| hono (bun)             | 258,544.51  | 321,676.62 | 236,456.38             | 217,500.53 |
| bun-web-standard (bun) | 248,768.747 | 298,349.06 | 223,540.2              | 224,416.98 |
| bun-bakery (bun)       | 246,406.697 | 294,704.34 | 191,002.93             | 253,512.82 |
| nhttp (bun)            | 246,062.48  | 304,262.4  | 222,742.3              | 211,182.74 |
| hyper-express (node)   | 233,220.883 | 342,484.41 | 262,511.55             | 94,666.69  |
| hyperbun (bun)         | 184,492.597 | 233,164.78 | 178,223.34             | 142,089.67 |
| baojs (bun)            | 178,269.3   | 195,637.03 | 168,948.92             | 170,221.95 |
| nbit (bun)             | 172,379.597 | 193,022    | 162,528.6              | 161,588.19 |
| h3 (node)              | 107,965.693 | 130,517.72 | 96,763.58              | 96,615.78  |
| fast (deno)            | 89,845.407  | 105,136.83 | 86,401.35              | 77,998.04  |
| fastify (node)         | 61,790.297  | 72,014.33  | 63,232.51              | 50,124.05  |
| cheetah (deno)         | 53,291.133  | 81,960.92  | 65,589.43              | 12,323.05  |
| oak (deno)             | 44,055.83   | 53,232.95  | 44,929.08              | 34,005.46  |
| abc (deno)             | 42,078.953  | 54,921.76  | 46,621.44              | 24,693.66  |
| koa (node)             | 38,261.317  | 44,455.84  | 39,101.86              | 31,226.25  |
| express (bun)          | 29,304.05   | 35,604     | 30,438.95              | 21,869.2   |
| hapi (node)            | 28,041.11   | 42,458.57  | 16,893.73              | 24,771.03  |
| adonis (node)          | 23,923.167  | 23,132.06  | 21,807.91              | 26,829.53  |
| express (node)         | 16,616.933  | 17,543.14  | 18,193.61              | 14,114.05  |
| hono (node)            | 14,520.24   | 16,511.59  | 15,667.26              | 11,381.87  |
| nest (node)            | 14,011.193  | 15,576.28  | 14,641.73              | 11,815.57  |
| acorn (deno)           | 3,162.36    | 5,170.88   | 2,446.1                | 1,870.1    |

See more detail in [results](https://github.com/SaltyAom/bun-http-framework-benchmark/tree/main/results)

## Notice

I highly recommended testing this benchmark on your machine yourself as performance in likely to vary between machine.
