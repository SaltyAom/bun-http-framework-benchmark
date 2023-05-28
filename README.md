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
        - To test if it pass the requirement, the implementation should be able to extract querystring **dynamically**, which means that the same code should be able to extract querystring, for example:
        - `/id/1?name=bun&id=1` -> should return `1 bun` not `1 bun&id=1`
        - `/id/1?id=1` -> should return `1 `
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
-   Intel I7-13700K, DDR5 32 5600MHz
-   Windows 11 22H2 build 22621.1555
-   Debian GNU/Linux 11 (Bullseye), kernel: 5.15.90.1-microsoft-standard-WSL2
-   Bun 0.6.3
-   Node 18.16.0
-   Deno 1.33.2

Tested on 26 May 2023 02:14 (GMT+7)

## Results

For results suffix with `-node` means that the framework is run in Node, otherwise is using Bun.

These results are measured in req/s:

| Framework            | Average     | Get (/)    | Params, query & header | Post JSON  |
| -------------------- | ----------- | ---------- | ---------------------- | ---------- |
| elysia (bun)         | 276,322.493 | 334,915.79 | 255,030.27             | 239,021.42 |
| stricjs (bun)        | 259,087.647 | 322,952.39 | 218,771.64             | 235,538.91 |
| hono (bun)           | 254,376.833 | 315,486.1  | 229,598.34             | 218,046.06 |
| nhttp (bun)          | 252,224.443 | 329,113.94 | 219,093.22             | 208,466.17 |
| bun (bun)            | 243,372.49  | 291,202.6  | 216,870.4              | 222,044.47 |
| hyper-express (node) | 230,523.47  | 328,808.12 | 262,945.37             | 99,816.92  |
| bun-bakery (bun)     | 213,358.427 | 272,519.99 | 187,252.9              | 180,302.39 |
| hyperbun (bun)       | 175,754.717 | 231,274.13 | 169,111.43             | 126,878.59 |
| baojs (bun)          | 173,587.383 | 196,869.54 | 158,004.8              | 165,887.81 |
| nbit (bun)           | 165,370.427 | 187,536.43 | 154,727.42             | 153,847.43 |
| h3 (node)            | 105,855.41  | 126,075.32 | 95,845.32              | 95,645.59  |
| fast (deno)          | 85,924.387  | 100,636.42 | 83,525.19              | 73,611.55  |
| koa (bun)            | 65,406.22   | 81,451.31  | 75,015.11              | 39,752.24  |
| fastify (node)       | 59,842.07   | 67,980.57  | 61,815.14              | 49,730.5   |
| cheetah (deno)       | 53,032.037  | 80,026.99  | 66,834.96              | 12,234.16  |
| oak (deno)           | 42,756.437  | 51,217.61  | 43,729.56              | 33,322.14  |
| abc (deno)           | 40,242.233  | 51,543.58  | 43,847.82              | 25,335.3   |
| koa (node)           | 37,198.257  | 43,410.17  | 37,870.43              | 30,314.17  |
| express (bun)        | 28,034.683  | 30,920.17  | 27,245.59              | 25,938.29  |
| hapi (node)          | 23,571.547  | 34,079.2   | 14,267.5               | 22,367.94  |
| adonis (node)        | 22,172.74   | 22,167.83  | 20,187.13              | 24,163.26  |
| express (node)       | 15,133.78   | 16,823.79  | 15,786.26              | 12,791.29  |
| nest (node)          | 13,510.537  | 14,957.84  | 14,189.36              | 11,384.41  |
| acorn (deno)         | 3,134.927   | 5,191.77   | 2,380.23               | 1,832.78   |


## Notice

I highly recommended testing this benchmark on your machine yourself as performance in likely to vary between machine.
