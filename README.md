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

| Framework    | Average     | Get (/)    | Params, query & header | Post JSON  |
| ------------ | ----------- | ---------- | ---------------------- | ---------- |
| stricjs      | 280,593.793 | 355,772.58 | 242,410.31             | 243,598.49 |
| elysia       | 277,339.81  | 340,776.9  | 260,965.09             | 230,277.44 |
| hono         | 265,256.703 | 335,801.28 | 241,630.81             | 218,338.02 |
| bun          | 255,715.547 | 309,858.2  | 226,863.16             | 230,425.28 |
| bun-bakery   | 217,284.657 | 279,832.55 | 189,816.55             | 182,204.87 |
| nhttp        | 214,645.223 | 315,077.41 | 158,770.62             | 170,087.64 |
| buchta       | 206,981.1   | 248,103.46 | 191,405.2              | 181,434.64 |
| baojs        | 185,017.863 | 203,582.65 | 176,267.96             | 175,202.98 |
| hyperbun     | 184,170.44  | 233,117.85 | 179,936.02             | 139,457.45 |
| nbit         | 166,773.457 | 183,093.7  | 154,804.56             | 162,422.11 |
| zarf         | 121,885.627 | 131,161.85 | 115,891.26             | 118,603.77 |
| fastify-node | 56,170.13   | 62,412.49  | 58,696.93              | 47,400.97  |
| koa-node     | 31,135.453  | 34,751.03  | 32,242.17              | 26,413.16  |
| express      | 28,447.373  | 31,779.18  | 27,985.04              | 25,577.9   |
| nest-node    | 16,479.217  | 25,768.73  | 13,073.81              | 10,595.11  |
| express-node | 14,380.517  | 15,540.01  | 15,331.07              | 12,270.47  |

## Notice

I highly recommended testing this benchmark on your machine yourself as performance in likely to vary between machine.
