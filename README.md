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
-   Bun 0.6.3
-   Node 18.16.0
-   Deno 1.33.2

Tested on 30 May 2023 12:23 (GMT+7)

## Results

For results suffix with `-node` means that the framework is run in Node, otherwise is using Bun.

These results are measured in req/s:

| Framework              | Average     | Get (/)    | Params, query & header | Post JSON  |
| ---------------------- | ----------- | ---------- | ---------------------- | ---------- |
| elysia (bun)           | 275,993.72  | 335,514.11 | 253,657.23             | 238,809.82 |
| stricjs (bun)          | 269,288.77  | 329,425.86 | 234,505.68             | 243,934.77 |
| bun (bun)              | 257,728.347 | 323,511.33 | 223,483.26             | 226,190.45 |
| nhttp (bun)            | 256,249.193 | 335,540.55 | 221,506.9              | 211,700.13 |
| hono (bun)             | 249,578.003 | 308,756.19 | 225,409.31             | 214,568.51 |
| bun-web-standard (bun) | 241,733.497 | 289,001.99 | 216,201.83             | 219,996.67 |
| hyper-express (node)   | 229,994.247 | 329,492.35 | 259,966.36             | 100,524.03 |
| bun-bakery (bun)       | 212,247.103 | 268,219.77 | 185,939.35             | 182,582.19 |
| hyperbun (bun)         | 179,631.653 | 230,223.48 | 172,764.56             | 135,906.92 |
| baojs (bun)            | 177,220.503 | 197,018.13 | 165,843.45             | 168,799.93 |
| nbit (bun)             | 168,602.197 | 191,325.17 | 160,248.74             | 154,232.68 |
| h3 (node)              | 106,973.877 | 128,138.82 | 95,354.26              | 97,428.55  |
| fast (deno)            | 88,152.64   | 102,491.12 | 85,881.66              | 76,085.14  |
| koa (bun)              | 67,196.8    | 84,217.76  | 77,075.41              | 40,297.23  |
| fastify (node)         | 60,968.25   | 71,986.81  | 60,994.37              | 49,923.57  |
| cheetah (deno)         | 54,579.51   | 82,192.51  | 69,167.98              | 12,378.04  |
| oak (deno)             | 44,434.68   | 53,314.65  | 45,843.89              | 34,145.5   |
| abc (deno)             | 41,763.38   | 53,635.38  | 46,275.85              | 25,378.91  |
| koa (node)             | 38,446.767  | 45,659.92  | 39,184.77              | 30,495.61  |
| express (bun)          | 28,192.243  | 30,658.98  | 27,572.39              | 26,345.36  |
| hapi (node)            | 24,359.327  | 33,914.11  | 14,354.74              | 24,809.13  |
| adonis (node)          | 22,513.517  | 22,001.05  | 20,710.63              | 24,828.87  |
| express (node)         | 14,982.47   | 15,870.51  | 16,149.31              | 12,927.59  |
| nest (node)            | 13,760.537  | 15,129.63  | 14,344.25              | 11,807.73  |
| acorn (deno)           | 3,133.867   | 5,204.64   | 2,352.99               | 1,843.97   |

See more detail in [results](https://github.com/SaltyAom/bun-http-framework-benchmark/tree/main/results)

## Notice

I highly recommended testing this benchmark on your machine yourself as performance in likely to vary between machine.
