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

Tested on 18 Apr 2023 13:35 (GMT+7)

## Results

For results suffix with `-node` means that the framework is run in Node, otherwise is using Bun.

These results are measured in req/s:

| Framework    | Get (/)    | Params, query & header | Post JSON  |
| ------------ | ---------- | ---------------------- | ---------- |
| elysia       | 344,791.22 | 263,612.52             | 235,796.86 |
| stricjs      | 356,143.7  | 231,659.61             | 245,792.46 |
| hono         | 334,626.3  | 241,552.5              | 219,746.78 |
| bun          | 294,067.13 | 226,598.72             | 228,328.47 |
| nhttp        | 318,091.47 | 159,021.2              | 170,937.27 |
| bun-bakery   | 281,655.7  | 184,956.64             | 180,998.59 |
| buchta       | 248,649.67 | 194,674.74             | 182,437.88 |
| hyperbun     | 236,609.57 | 181,209.31             | 141,963.08 |
| baojs        | 196,468.76 | 162,102.51             | 164,309.21 |
| nbit         | 195,164.19 | 162,065.69             | 159,875.77 |
| zarf         | 131,504.28 | 115,325.55             | 118,147.68 |
| fastify-node | 62,488.34  | 59,195.1               | 47,359.08  |
| bagel        | 32,018     | 31,203.58              | 87,101.13  |
| koa-node     | 43,301.3   | 37,661.48              | 29,871.35  |
| express      | 30,609.26  | 26,795.35              | 24,205.52  |
| nest-node    | 18,685.35  | 13,702.46              | 10,901.65  |
| express-node | 15,114.59  | 15,347.31              | 12,254.68  |

## Notice

I highly recommended testing this benchmark on your machine yourself as performance in likely to vary between machine.
