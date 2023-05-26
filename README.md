# Bun HTTP Framework Benchmark

Compare throughput benchmarks from various Bun HTTP framework

Test method: Average throughput

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
-   Bun 0.6.3
-   Node 18.16.0
-   Deno 1.33.2

Tested on 26 May 2023 21:52 (GMT+7)

## Results

For results suffix with `-node` means that the framework is run in Node, otherwise is using Bun.

These results are measured in req/s:

| Framework            | Average     | Get (/)    | Params, query & header | Post JSON  |
| -------------------- | ----------- | ---------- | ---------------------- | ---------- |
| elysia (bun)         | 281,245.233 | 341,023.04 | 259,196.2              | 243,516.46 |
| stricjs (bun)        | 269,784.273 | 335,217.67 | 231,269.37             | 242,865.78 |
| nhttp (bun)          | 264,176.37  | 345,410.52 | 228,425.08             | 218,693.51 |
| hono (bun)           | 256,430.093 | 315,054.29 | 230,732.26             | 223,503.73 |
| bun (bun)            | 245,590.547 | 294,572.59 | 218,590.85             | 223,608.2  |
| hyper-express (node) | 238,569.38  | 342,763.26 | 269,976.92             | 102,967.96 |
| bun-bakery (bun)     | 213,981.447 | 274,986.12 | 187,945.38             | 179,012.84 |
| hyperbun (bun)       | 185,625.05  | 235,457.12 | 181,603.64             | 139,814.39 |
| baojs (bun)          | 180,050.753 | 205,243.13 | 158,808.34             | 176,100.79 |
| nbit (bun)           | 172,401.67  | 194,931.75 | 162,156.21             | 160,117.05 |
| h3 (node)            | 108,493.647 | 133,311.81 | 97,299.01              | 94,870.12  |
| fast (deno)          | 90,080.317  | 105,865.54 | 87,188.45              | 77,186.96  |
| koa (bun)            | 70,297.953  | 88,625.21  | 80,841.17              | 41,427.48  |
| fastify (node)       | 62,356.223  | 74,714.2   | 63,538.19              | 48,816.28  |
| cheetah (deno)       | 55,370.243  | 83,430.56  | 70,071.93              | 12,608.24  |
| oak (deno)           | 42,944.747  | 50,501.33  | 43,334.81              | 34,998.1   |
| abc (deno)           | 42,090.16   | 55,205.58  | 46,013.98              | 25,050.92  |
| koa (node)           | 39,440.373  | 46,076.52  | 40,622.93              | 31,621.67  |
| express (bun)        | 28,894.5    | 32,175.32  | 28,537.97              | 25,970.21  |
| hapi (node)          | 24,350.977  | 35,914.11  | 14,022.15              | 23,116.67  |
| adonis (node)        | 22,877.913  | 22,598.71  | 21,083.13              | 24,951.9   |
| express (node)       | 15,799.88   | 17,220.29  | 16,769.52              | 13,409.83  |
| nest (node)          | 13,810.427  | 15,329.07  | 14,449.38              | 11,652.83  |
| acorn (deno)         | 3,152.467   | 5,237.64   | 2,399.81               | 1,819.95   |

## Notice

I highly recommended testing this benchmark on your machine yourself as performance in likely to vary between machine.
