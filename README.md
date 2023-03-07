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
-   Bun 0.5.7
-   Node 18.14.2

Tested on 8 Mar 2023 12:08 (GMT+7)

## Results

For results suffix with `-node` means that the framework is run in Node, otherwise is using Bun.

These results are measured in req/s:

| Framework    | Get (/)    | Params, query & header | Post JSON  |
| ------------ | ---------- | ---------------------- | ---------- |
| stricjs      | 358,420.32 | 217,264.49             | 242,579.53 |
| elysia       | 332,186.86 | 241,814.47             | 220,267.42 |
| hono         | 335,614.78 | 237,821.33             | 202,863.64 |
| bun          | 293,286.89 | 225,051.14             | 222,384.17 |
| bun-bakery   | 284,124.72 | 191,443.62             | 183,606.15 |
| buchta       | 246,575.88 | 194,267.66             | 184,283.29 |
| baojs        | 205,530.92 | 176,228.64             | 176,780.67 |
| hyperbun     | 235,306.6  | 180,835.21             | 142,176.65 |
| nbit         | 197,169.15 | 166,178.08             | 161,524.26 |
| zarf         | 131,048.87 | 117,136.96             | 119,880.84 |
| bagel        | 118,429.49 | 83,730.49              | 91,116.46  |
| fastify-node | 64,715.2   | 59,450.78              | 48,975.9   |
| koa-node     | 43,273.05  | 37,895.64              | 30,708.98  |
| express      | 31,851.71  | 30,703.92              | 25,727.83  |
| express-node | 16,323.47  | 15,570.08              | 12,143.09  |
| nest-node    | 15,644.89  | 13,016.44              | 10,888.6   |

## Notice

I highly recommended testing this benchmark on your machine yourself as performance in likely to vary between machine.
