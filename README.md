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
-   AMD Ryzen 5 3500X, DDR4 RAM 16GB 2667MHz
-   Windows 11 22H2 build 22621.963
-   Debian GNU/Linux 11 (Bullseye), kernel: 5.15.79.1-microsoft-standard-WSL2
-   Bun 0.5.4
-   Node 18.12.1

Tested on 1 Feb 2023 18:34 (GMT+7)

## Results

For results suffix with `-node` means that the framework is run in Node, otherwise is using Bun.

These results are measured in req/s:

| Framework    | Get (/)    | Params, query & header | Post JSON  |
| ------------ | ---------- | ---------------------- | ---------- |
| stricjs      | 163,144.35 | 93,585.61              | 107,706.94 |
| elysia       | 146,906.79 | 105,250.62             | 94,995.78  |
| bun          | 133,014.21 | 97,790.76              | 102,198.34 |
| hono         | 144,302.73 | 86,934.76              | 88,689.36  |
| bun-bakery   | 127,466.08 | 90,404.5               | 77,485.06  |
| hyperbun     | 109,392.22 | 78,455.9               | 64,766.49  |
| buchta       | 96,966.82  | 74,232.76              | 80,341.38  |
| baojs        | 89,392.61  | 78,219.12              | 75,915.04  |
| nbit         | 86,645.24  | 74,970.16              | 71,982.93  |
| zarf         | 61,395.49  | 51,920.41              | 52,402.81  |
| bagel        | 52,115.82  | 36,773.09              | 40,173.15  |
| fastify-node | 27,913.35  | 18,680.43              | 12,632.05  |
| koa-node     | 12,017.67  | 10,949.44              | 9,163.69   |
| express      | 10,774.41  | 10,371.74              | 10,466.22  |
| nest-node    | 15,787.92  | 5,428.93               | 4,611.93   |
| express-node | 6,625.82   | 5,963.38               | 4,977.46   |

## Notice

I highly recommended testing this benchmark on your machine yourself as performance in likely to vary between machine.
