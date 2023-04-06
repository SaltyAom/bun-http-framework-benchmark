# Bun HTTP Framework Benchmark

Compare throughput benchmarks from various Bun HTTP framework

Library/framework:

-   bagel
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
-   Windows 11 22H2 build 22621.1265
-   Debian GNU/Linux 11 (Bullseye), kernel: 5.15.90.1-microsoft-standard-WSL2
-   Bun 0.5.9
-   Node 18.14.2

Tested on 7 Apr 2023 12:54 (GMT+7)

## Results

For results suffix with `-node` means that the framework is run in Node, otherwise is using Bun.

These results are measured in req/s:

| Framework    | Get (/)    | Params, query & header | Post JSON  |
| ------------ | ---------- | ---------------------- | ---------- |
| elysia       | 347,038.45 | 269,534.06             | 233,983.96 |
| stricjs      | 366,984.81 | 221,213.31             | 248,739.99 |
| hono         | 336,138.55 | 242,243.77             | 223,557.79 |
| bun          | 299,094.95 | 231,036.28             | 233,892.71 |
| bun-bakery   | 287,027.09 | 197,158.87             | 183,838.77 |
| nhttp        | 320,216.5  | 163,287.63             | 175,624.3  |
| buchta       | 255,251.05 | 197,027.72             | 187,122.66 |
| baojs        | 208,973.42 | 178,961.83             | 180,340.38 |
| hyperbun     | 237,351.18 | 183,900.43             | 145,605.13 |
| nbit         | 200,341.75 | 168,711                | 164,215.61 |
| zarf         | 134,141.93 | 117,656.34             | 125,447.23 |
| fastify-node | 63,944.69  | 58,518.17              | 47,579.97  |
| bagel        | 32,839.83  | 32,279.18              | 93,576.95  |
| koa-node     | 34,247.37  | 31,590.15              | 26,552.78  |
| express      | 32,052.25  | 28,632.71              | 25,863.87  |
| nest-node    | 20,578.89  | 13,694.74              | 10,986.61  |
| express-node | 15,917.13  | 15,617.57              | 12,562.9   |

## Notice

I highly recommended testing this benchmark on your machine yourself as performance in likely to vary between machine.
