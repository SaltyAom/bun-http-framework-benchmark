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

Tested on 30 Mar 2023 1220:10 (GMT+7)

## Results

For results suffix with `-node` means that the framework is run in Node, otherwise is using Bun.

These results are measured in req/s:

| Framework    | Get (/)    | Params, query & header | Post JSON  |
| ------------ | ---------- | ---------------------- | ---------- |
| elysia       | 342,205.98 | 265,986.07             | 229,538.82 |
| stricjs      | 360,531.93 | 219,655.73             | 239,244.21 |
| hono         | 338,104.4  | 240,167.57             | 221,736.14 |
| bun          | 287,906.23 | 225,638.75             | 220,582.62 |
| bun-bakery   | 285,787.48 | 191,007.49             | 180,858.32 |
| nhttp        | 314,401.82 | 161,916.79             | 161,661.75 |
| buchta       | 237,914.83 | 195,581.79             | 184,804.62 |
| hyperbun     | 236,774.58 | 180,559.07             | 142,115.16 |
| baojs        | 205,506.21 | 176,729.65             | 176,705.43 |
| nbit         | 197,142.94 | 163,428.22             | 160,551.47 |
| zarf         | 133,445.47 | 115,158.61             | 120,154.71 |
| bagel        | 119,782.04 | 84,029.01              | 92,238.01  |
| fastify-node | 63,651.11  | 58,664.56              | 48,017.8   |
| koa-node     | 43,382.56  | 38,177.83              | 30,482.18  |
| express      | 31,510.72  | 29,908.7               | 26,668.61  |
| nest-node    | 32,491.11  | 13,565.53              | 10,977.84  |
| express-node | 16,519.1   | 15,149.07              | 11,851.41  |

## Notice

I highly recommended testing this benchmark on your machine yourself as performance in likely to vary between machine.
