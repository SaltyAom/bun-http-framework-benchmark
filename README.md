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
-   Deno
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
-   Bun 0.6.2
-   Node 18.16.0
-   Deno 1.33.2

Tested on 16 May 2023 14:08 (GMT+7)

## Results

For results suffix with `-node` means that the framework is run in Node, otherwise is using Bun.

These results are measured in req/s:

| Framework            | Average     | Get (/)    | Params, query & header | Post JSON  |
| -------------------- | ----------- | ---------- | ---------------------- | ---------- |
| elysia (bun)         | 284,662.797 | 345,637.75 | 262,795.72             | 245,554.92 |
| stricjs (bun)        | 274,770.427 | 343,659.7  | 236,470.53             | 244,181.05 |
| hono (bun)           | 262,037.707 | 324,185.42 | 236,221                | 225,706.7  |
| bun (bun)            | 253,300.373 | 306,429.05 | 222,070.93             | 231,401.14 |
| hyper-express (node) | 234,981.563 | 333,461.81 | 263,739.11             | 107,743.77 |
| bun-bakery (bun)     | 220,101.343 | 279,866.81 | 192,805.24             | 187,631.98 |
| nhttp (bun)          | 206,417.313 | 312,420.66 | 143,476.57             | 163,354.71 |
| buchta (bun)         | 206,078.807 | 246,237.03 | 190,674.54             | 181,324.85 |
| hyperbun (bun)       | 186,796.023 | 238,330.07 | 180,080.56             | 141,977.44 |
| baojs (bun)          | 185,202.2   | 205,673.94 | 173,645.51             | 176,287.15 |
| nbit (bun)           | 174,576.933 | 198,571.83 | 164,999.98             | 160,158.99 |
| h3 (node)            | 109,617.857 | 130,994    | 99,572.17              | 98,287.4   |
| fast (deno)          | 88,510.34   | 104,780.59 | 84,515.27              | 76,235.16  |
| koa (bun)            | 70,075.613  | 89,224.7   | 79,528.8               | 41,473.34  |
| fastify (node)       | 64,727.17   | 75,705.2   | 66,226.84              | 52,249.47  |
| cheetah (deno)       | 55,155.837  | 82,902.35  | 70,165.79              | 12,399.37  |
| oak (deno)           | 42,271.167  | 49,553.49  | 42,784.45              | 34,475.56  |
| abc (deno)           | 42,140.583  | 54,708.47  | 46,936.13              | 24,777.15  |
| koa (node)           | 38,782.827  | 46,292.35  | 39,337.44              | 30,718.69  |
| express (bun)        | 28,797.03   | 31,622.6   | 28,235.14              | 26,533.35  |
| adonis (node)        | 22,003.19   | 21,345.2   | 20,445.22              | 24,219.15  |
| express (node)       | 15,861.363  | 17,279.32  | 16,807.36              | 13,497.41  |
| nest (node)          | 13,930.077  | 15,537.63  | 14,441.98              | 11,810.62  |
| acorn (deno)         | 3,183.34    | 5,281.78   | 2,417.67               | 1,850.57   |



## Notice

I highly recommended testing this benchmark on your machine yourself as performance in likely to vary between machine.
