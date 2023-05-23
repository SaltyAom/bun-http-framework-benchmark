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

Tested on 23 May 2023 11:10 (GMT+7)

## Results

For results suffix with `-node` means that the framework is run in Node, otherwise is using Bun.

These results are measured in req/s:

| Framework            | Average     | Get (/)    | Params, query & header | Post JSON  |
| -------------------- | ----------- | ---------- | ---------------------- | ---------- |
| elysia (bun)         | 276,702.29  | 333,331.26 | 257,278.69             | 239,496.92 |
| hono (bun)           | 256,059.003 | 317,679.66 | 231,320.91             | 219,176.44 |
| stricjs (bun)        | 245,872.02  | 298,244.57 | 213,008.46             | 226,363.03 |
| nhttp (bun)          | 245,427.333 | 310,534.3  | 224,823.52             | 200,924.18 |
| bun (bun)            | 245,382.727 | 294,718.53 | 220,138.89             | 221,290.76 |
| hyper-express (node) | 220,583.3   | 348,786.1  | 270,224.99             | 42,738.81  |
| bun-bakery (bun)     | 215,970.547 | 275,143.22 | 189,063.54             | 183,704.88 |
| hyperbun (bun)       | 181,929.047 | 230,629.12 | 175,784.76             | 139,373.26 |
| baojs (bun)          | 181,826.43  | 202,008.41 | 170,468.46             | 173,002.42 |
| nbit (bun)           | 171,849.6   | 195,186.36 | 162,162.7              | 158,199.74 |
| h3 (node)            | 106,052.593 | 127,251.72 | 93,731.37              | 97,174.69  |
| fast (deno)          | 88,659.717  | 104,516.33 | 85,522.41              | 75,940.41  |
| koa (bun)            | 68,532.863  | 87,066.15  | 77,397.2               | 41,135.24  |
| fastify (node)       | 63,687.393  | 75,894.2   | 65,037.6               | 50,130.38  |
| cheetah (deno)       | 53,374.26   | 78,662.68  | 69,021.25              | 12,438.85  |
| oak (deno)           | 43,950.047  | 52,752.14  | 45,062.12              | 34,035.88  |
| abc (deno)           | 41,526.8    | 53,571.29  | 45,303.88              | 25,705.23  |
| koa (node)           | 36,937.56   | 45,337.27  | 36,597.73              | 28,877.68  |
| express (bun)        | 28,788.5    | 32,125.19  | 28,074.64              | 26,165.67  |
| adonis (node)        | 21,297.507  | 20,883.91  | 19,916.41              | 23,092.2   |
| express (node)       | 15,289.7    | 17,050.36  | 16,045.5               | 12,773.24  |
| nest (node)          | 14,131.62   | 15,705.36  | 14,858.95              | 11,830.55  |
| acorn (deno)         | 3,133.93    | 5,213.87   | 2,364.39               | 1,823.53   |

## Notice

I highly recommended testing this benchmark on your machine yourself as performance in likely to vary between machine.
