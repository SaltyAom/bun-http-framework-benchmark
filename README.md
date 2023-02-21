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
-   Bun 0.5.6
-   Node 18.12.1

Tested on 21 Feb 2023 19:19 (GMT+7)

## Results

For results suffix with `-node` means that the framework is run in Node, otherwise is using Bun.

These results are measured in req/s:

| Framework    | Get (/)    | Params, query & header | Post JSON |
| ------------ | ---------- | ---------------------- | --------- |
| stricjs      | 147,495.81 | 83,392.93              | 99,545.78 |
| elysia       | 138,055.57 | 96,651.02              | 93,269.54 |
| hono         | 137,363.24 | 96,908.63              | 83,535.1  |
| bun          | 126,377.67 | 88,464.87              | 93,505.79 |
| bun-bakery   | 116,297.98 | 82,001.51              | 73,519.62 |
| hyperbun     | 99,653.83  | 76,623.24              | 57,629.79 |
| baojs        | 81,579.49  | 70,479.39              | 71,922.27 |
| buchta       | 86,508.01  | 63,164.2               | 70,905.64 |
| nbit         | 77,934.51  | 66,313.41              | 64,885.51 |
| zarf         | 56,239.29  | 46,860.55              | 50,286.27 |
| bagel        | 48,031.56  | 35,119.75              | 37,595.17 |
| fastify-node | 30,001.15  | 16,847.79              | 11,536.58 |
| koa-node     | 12,213.62  | 10,226.89              | 8,439.79  |
| nest-node    | 21,300.82  | 4,895.06               | 4,017.4   |
| express      | 9,554.71   | 9,777.45               | 9,845.45  |
| express-node | 7,593.15   | 5,408.79               | 4,559.03  |

## Notice

I highly recommended testing this benchmark on your machine yourself as performance in likely to vary between machine.
