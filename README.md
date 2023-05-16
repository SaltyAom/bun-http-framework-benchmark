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

Tested on 16 May 2023 14:08 (GMT+7)

## Results

For results suffix with `-node` means that the framework is run in Node, otherwise is using Bun.

These results are measured in req/s:

| Framework            | Average     | Get (/)    | Params, query & header | Post JSON  |
| -------------------- | ----------- | ---------- | ---------------------- | ---------- |
| elysia (bun)         | 293,815.33  | 367,270.28 | 270,164.64             | 244,011.07 |
| stricjs (bun)        | 278,251.863 | 350,602.31 | 239,787.64             | 244,365.64 |
| hono (bun)           | 265,596.5   | 335,321.8  | 242,275.91             | 219,191.79 |
| bun (bun)            | 256,294.247 | 311,625.22 | 226,667.9              | 230,589.62 |
| hyper-express (node) | 237,175.837 | 335,805.52 | 266,540.88             | 109,181.11 |
| bun-bakery (bun)     | 218,979.433 | 283,377.15 | 191,467.06             | 182,094.09 |
| nhttp (bun)          | 211,291.977 | 321,654.3  | 145,626.92             | 166,594.71 |
| buchta (bun)         | 207,552.687 | 248,031.6  | 192,872.57             | 181,753.89 |
| hyperbun (bun)       | 186,341.503 | 236,043.81 | 182,076.17             | 140,904.53 |
| baojs (bun)          | 183,334.81  | 202,913.14 | 173,782.13             | 173,309.16 |
| nbit (bun)           | 173,030.427 | 198,597.76 | 162,412.72             | 158,080.8  |
| zarf (bun)           | 123,049.987 | 132,052.42 | 117,262.51             | 119,835.03 |
| fast (deno)          | 88,488.307  | 103,736.73 | 85,782.75              | 75,945.44  |
| koa (bun)            | 66,684.19   | 87,660.29  | 75,684.87              | 36,707.41  |
| fastify (node)       | 61,625.033  | 72,075.03  | 62,307.56              | 50,492.51  |
| cheetah (deno)       | 54,520.1    | 82,382.11  | 68,906.26              | 12,271.93  |
| oak (deno)           | 42,419.187  | 50,191.64  | 42,562.79              | 34,503.13  |
| abc (deno)           | 41,550.713  | 53,242.23  | 45,754.1               | 25,655.81  |
| koa (node)           | 37,993.357  | 44,323.74  | 39,157.39              | 30,498.94  |
| express (bun)        | 27,949.85   | 30,905.78  | 27,627.52              | 25,316.25  |
| express (node)       | 15,440.627  | 16,890.15  | 16,633.24              | 12,798.49  |
| nest (node)          | 13,722.543  | 15,291.74  | 14,439.2               | 11,436.69  |
| acorn (deno)         | 3,147.593   | 5,237.26   | 2,387.76               | 1,817.76   |


## Notice

I highly recommended testing this benchmark on your machine yourself as performance in likely to vary between machine.
