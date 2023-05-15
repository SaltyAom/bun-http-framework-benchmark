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

Tested on 16 May 2023 00:22 (GMT+7)

## Results

For results suffix with `-node` means that the framework is run in Node, otherwise is using Bun.

These results are measured in req/s:

| Framework        | Average     | Get (/)    | Params, query & header | Post JSON  |
| ---------------- | ----------- | ---------- | ---------------------- | ---------- |
| elysia (bun)     | 290,426.473 | 357,078.76 | 268,673.92             | 245,526.74 |
| stricjs (bun)    | 278,085.71  | 350,660.84 | 241,546.33             | 242,049.96 |
| hono (bun)       | 264,664.807 | 332,387.83 | 240,328.49             | 221,278.1  |
| bun (bun)        | 254,417.61  | 308,446.32 | 225,118.11             | 229,688.4  |
| bun-bakery (bun) | 219,616.187 | 283,474.7  | 192,639.89             | 182,733.97 |
| nhttp (bun)      | 211,800.267 | 323,659.45 | 145,210.07             | 166,531.28 |
| buchta (bun)     | 209,509.043 | 252,755.96 | 193,478.25             | 182,292.92 |
| hyperbun (bun)   | 186,535.38  | 236,203.65 | 181,428.18             | 141,974.31 |
| baojs (bun)      | 186,113.75  | 205,806.23 | 176,301.98             | 176,233.04 |
| nbit (bun)       | 175,664.893 | 199,724.47 | 166,095.37             | 161,174.84 |
| zarf (bun)       | 122,939.88  | 131,985.17 | 117,110.78             | 119,723.69 |
| fast (deno)      | 89,499.92   | 105,858.18 | 86,283.08              | 76,358.5   |
| koa-node (bun)   | 68,052.987  | 87,541.41  | 79,194.23              | 37,423.32  |
| cheetah (deno)   | 55,047.97   | 83,068.46  | 69,641.78              | 12,433.67  |
| oak (deno)       | 42,472.85   | 49,980.46  | 42,825.04              | 34,613.05  |
| abc (deno)       | 41,581.483  | 53,902.53  | 45,608.01              | 25,233.91  |
| express (bun)    | 27,796.8    | 30,722.52  | 27,516.55              | 25,151.33  |
| nest (node)      | 14,172.13   | 15,949.8   | 14,867.06              | 11,699.53  |
| acorn (deno)     | 3,201.31    | 5,321.31   | 2,427.58               | 1,855.04   |


## Notice

I highly recommended testing this benchmark on your machine yourself as performance in likely to vary between machine.
