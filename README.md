# Bun HTTP Framework Benchmark

Compare throughput benchmarks from various Bun HTTP framework

Library/framework:

-   baojs
-   buchta
-   bun
-   bun-bakery
-   elysia
-   express
-   express-node
-   fastify-node
-   hono
-   hyperbun
-   koa-node
-   nbit
-   nest-node
-   stricjs
-   zarf

Test method:
Throughput

1. Get (/)
    - [GET] `/`
    - Return `hi` in plain text
2. Params, query & header
    - [GET] `/id/:id`
    - Extract path params, query and header.
    - For this benchmark, the request URL will be send as: `/id/1?name=bun`
    - Set `x-powered-by` to `benchmark`
    - Expected response: **"1 bun"** (`${id} ${query}`)
3. Post JSON
    - [POST] `/json`
    - Mirror body to response
    - For the benchmark, the request body will be sent as: `{ "hello": "world" }`
    - Expected response: `{ "hello": "world" }`

# Prerequistes

-   [bombardier](https://github.com/codesenberg/bombardier)
-   Nodejs
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
-   Bun 0.5.9
-   Node 18.16.0

Tested on 7 May 2023 17:03 (GMT+7)

## Results

For results suffix with `-node` means that the framework is run in Node, otherwise is using Bun.

These results are measured in req/s:

| Framework        | Average     | Get (/)    | Params, query & header | Post JSON  |
| ---------------- | ----------- | ---------- | ---------------------- | ---------- |
| elysia (bun)     | 289,634.273 | 362,395.4  | 266,498.91             | 240,008.51 |
| stricjs (bun)    | 275,995.547 | 350,609.17 | 236,945.68             | 240,431.79 |
| hono (bun)       | 261,449.51  | 330,017.53 | 236,956.73             | 217,374.27 |
| bun (bun)        | 252,754.03  | 306,891.29 | 222,853.6              | 228,517.2  |
| bun-bakery (bun) | 217,500.707 | 281,155.77 | 191,781.32             | 179,565.03 |
| nhttp (bun)      | 216,123.583 | 320,882.64 | 158,514.91             | 168,973.2  |
| buchta (bun)     | 207,732.543 | 248,463.36 | 192,427.61             | 182,306.66 |
| hyperbun (bun)   | 184,092.563 | 233,791.3  | 178,293.58             | 140,192.81 |
| baojs (bun)      | 183,177.883 | 201,969.71 | 173,924.02             | 173,639.92 |
| nbit (bun)       | 171,721.733 | 195,587.73 | 162,044.98             | 157,532.49 |
| zarf (bun)       | 121,209.297 | 129,418.5  | 114,798.89             | 119,410.5  |
| fast (deno)      | 87,528.397  | 103,253.28 | 84,427.85              | 74,904.06  |
| koa-node (bun)   | 64,795.26   | 88,220.51  | 79,119.08              | 27,046.19  |
| cheetah (deno)   | 53,256.853  | 80,262.37  | 67,307.44              | 12,200.75  |
| oak (deno)       | 43,414.683  | 51,696.92  | 44,559.06              | 33,988.07  |
| abc (deno)       | 40,418.437  | 52,716.69  | 44,233.71              | 24,304.91  |
| express (bun)    | 27,318.333  | 29,986.31  | 26,881.3               | 25,087.39  |
| nest (node)      | 13,857.613  | 15,038.72  | 14,518.04              | 12,016.08  |
| acorn (deno)     | 3,141.2     | 5,154.86   | 2,443.66               | 1,825.08   |

## Notice

I highly recommended testing this benchmark on your machine yourself as performance in likely to vary between machine.
