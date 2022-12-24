# Bun HTTP Framework Benchmark

Compare throughput benchmarks from various Bun HTTP framework

Library/framework:

-   bagel
-   baojs
-   buchta
-   bun
-   bun-bakery
-   elysia ~~(previously kingworld)~~
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

Tested on 25 Dec 1:31 (GMT+7)

## Results

For results suffix with `-node` means that the framework is run in Node, otherwise is using Bun.

These results are measured in req/s:

| Framework    | Get (/)    | Params, query & header | Post JSON  |
| ------------ | ---------- | ---------------------- | ---------- |
| bagel        | 52,480.14  | 38,559.33              | 40,839.07  |
| baojs        | 94,425.75  | 81,870.93              | 79,090.07  |
| buchta       | 108,359.82 | 81,744.09              | 83,432.06  |
| bun          | 143,179.64 | 106,306.16             | 102,027.23 |
| bun-bakery   | 121,099.15 | 90,149.68              | 73,999.25  |
| elysia       | 158,842.77 | 118,570.52             | 122,342.47 |
| express      | 8,313.09   | 8,177.43               | 7,765.92   |
| express-node | 6,350.76   | 6,051.1                | 5,812.16   |
| fastify-node | 24,448.88  | 19,125.56              | 10,136.47  |
| hono         | 166,430.02 | 95,942.99              | 97,052.24  |
| hyperbun     | 115,502.26 | 82,832.1               | 64,588.61  |
| koa-node     | 11,233.31  | 10,525.02              | 9,428.71   |
| nbit         | 90,452.17  | 75,916.21              | 62,592.92  |
| nest-node    | 19,216.1   | 5,794.28               | 5,325.94   |
| zarf         | 63,663.53  | 54,291.81              | 54,307.66  |

## Notice

I highly recommended testing this benchmark on your machine yourself.
