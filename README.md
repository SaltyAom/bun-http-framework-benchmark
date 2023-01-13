# Bun HTTP Framework Benchmark

Compare throughput benchmarks from various Bun HTTP framework

Library/framework:

-   bagel
-   baojs
-   buchta
-   bun
-   bun-bakery
-   bunsrv
-   elysia
-   express
-   express-node
-   fastify-node
-   hono
-   hyperbun
-   koa-node
-   nbit
-   nest-node
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
-   Bun 0.4.0
-   Node 18.12.1

Tested on 13 Jan 20:03 (GMT+7)

## Results

For results suffix with `-node` means that the framework is run in Node, otherwise is using Bun.

These results are measured in req/s:

| Framework    | Get (/)    | Params, query & header | Post JSON  |
| ------------ | ---------- | ---------------------- | ---------- |
| elysia       | 153,311.1  | 117,089.1              | 120,017.59 |
| hono         | 158,446    | 93,635.58              | 96,371.24  |
| bun          | 142,764.27 | 103,046.45             | 100,987.19 |
| bunsvr       | 143,069.05 | 97,957.54              | 100,335.14 |
| bun-bakery   | 118,771.61 | 87,894.1               | 73,665.9   |
| hyperbun     | 113,340.99 | 84,710.57              | 65,096.04  |
| buchta       | 102,047.58 | 79,021.58              | 79,741.77  |
| baojs        | 94,055.63  | 80,983.87              | 77,019.2   |
| nbit         | 90,104.72  | 75,293.36              | 62,712.51  |
| zarf         | 62,915.93  | 53,118.17              | 53,598.07  |
| bagel        | 55,670.22  | 38,167.58              | 40,241.19  |
| fastify-node | 21,772.82  | 17,524.96              | 9,599.67   |
| koa-node     | 11,013.72  | 10,442.14              | 9,430.87   |
| express      | 8,022.62   | 8,179.15               | 7,814.99   |
| nest-node    | 11,388.29  | 5,518.08               | 5,299.28   |
| express-node | 5,961.13   | 5,871.17               | 5,845.57   |

## Notice

I highly recommended testing this benchmark on your machine yourself.
