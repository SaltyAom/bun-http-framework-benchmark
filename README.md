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

Tested on 28 Dec 16:05 (GMT+7)

## Results

For results suffix with `-node` means that the framework is run in Node, otherwise is using Bun.

These results are measured in req/s:

| Framework    | Get (/)    | Params, query & header | Post JSON  |
| ------------ | ---------- | ---------------------- | ---------- |
| elysia       | 152,980.47 | 115,383.16             | 119,118.21 |
| bun          | 138,693.64 | 102,338.25             | 101,639.79 |
| hono         | 155,712.34 | 90,505.18              | 95,364.71  |
| bun-bakery   | 119,547.77 | 88,697.24              | 73,704.69  |
| buchta       | 107,372.43 | 80,901.02              | 81,466.78  |
| hyperbun     | 113,408.18 | 83,602.41              | 65,456.92  |
| baojs        | 87,518.82  | 71,266.51              | 78,484.64  |
| nbit         | 90,240.45  | 75,148.06              | 61,638.81  |
| zarf         | 62,537.12  | 52,367.75              | 53,639.11  |
| bagel        | 55,069.09  | 38,462.54              | 39,788.87  |
| fastify-node | 25,601.9   | 18,912.68              | 10,006.57  |
| nest-node    | 20,711.49  | 5,503.76               | 5,297.85   |
| koa-node     | 10,944.96  | 10,457.9               | 9,442.62   |
| express-node | 6,943.85   | 6,013.53               | 5,610.83   |

## Notice

I highly recommended testing this benchmark on your machine yourself.
