# Bun HTTP Framework Benchmark

Compare throughput benchmarks from various JavaScript HTTP framework

Test method: Average throughput

1. Ping
    - Request to [GET] `/`
    - Return `hi`
    - Headers must contains text `Content-Type: text/plain`, additional context is acceptable eg. `Content-Type: text/plain; charset=utf-8`
2. Query
    - Request to [GET] `/id/:id`
    - Extract path parameter, query string and setting headers.
    - For this benchmark, the request URL will be send as: `/id/1?name=bun`
    - Headers must contains `x-powered-by` to `benchmark`
    - Expected response: **"1 bun"** (`${id} ${query}`)
        - You **MUST NOT use hardcode string or index** to extract querystring.
        - In a real-world situation, there's no enforcement that the request will follow the specification, using hardcode index to extract `name=bun` querystring will be prone to error.
        - To test if it pass the requirement, the implementation should be able to extract querystring **dynamically** (please treat the value of 'name=bun' can be any value beside 'bun', for example 'alice', 'hina'), which means that the same code should be able to extract querystring, for example:
        - `/id/1?name=bun&id=1` -> should return `1 bun` not `1 bun&id=1`
        - `/id/1?id=1` -> should return `1 `
        - Query beside `name` maybe not need to be extracted and is optional
    - Headers must contains text `Content-Type: text/plain`, additional context is acceptable eg. `Content-Type: text/plain; charset=utf-8`
3. Body
    - [POST] `/json`
    - Mirror body to response
    - Server **MUST parse body to JSON and serialize back to string**
    - For the benchmark, the request body will be sent as: `{ "hello": "world" }`
    - Expected response: `{ "hello": "world" }`
    - Headers must contains text `Content-Type: application/json`, additional context is acceptable eg. `Content-Type: application/json; charset=utf-8`.

# Prerequistes

-   [bombardier](https://github.com/codesenberg/bombardier)
-   Nodejs
-   Deno
-   Bun

# Run Test

```typescript
bun benchmark
```

Dump result will be available at `results/[benchmark-name].txt`

## Benchmark Condition

This benchmark is tested under the following condition:

-   Windows 11 under WSL Debian
-   Intel I7-13700K, DDR5 32GB 5600MHz
-   Windows 11 22H2 build 22631.3527
-   Debian GNU/Linux 11 (Bullseye), kernel: 5.15.146.1-microsoft-standard-WSL2
-   Bun 1.1.7
-   Node 20.11.1
-   Deno 1.41.1

Tested on 9 May 2024 22:12 (GMT+7)

## Results

These results are measured in req/s:

| Framework        | Runtime | Average     | Ping       | Query      | Body       |
| ---------------- | ------- | ----------- | ---------- | ---------- | ---------- |
| uws              | node    | 350,073.513 | 416,078.78 | 375,035.58 | 259,106.18 |
| vixeny           | bun     | 270,219.483 | 319,830.3  | 270,491.64 | 220,336.51 |
| stricjs          | bun     | 269,959.177 | 318,819.92 | 269,139.41 | 221,918.2  |
| bun              | bun     | 263,598.457 | 320,691.95 | 243,593.78 | 226,509.64 |
| elysia           | bun     | 257,013.953 | 312,243.46 | 246,844.03 | 211,954.37 |
| byte             | bun     | 249,993.41  | 274,377.84 | 257,422.32 | 218,180.07 |
| hyper-express    | node    | 247,393.243 | 329,014.32 | 256,104.1  | 157,061.31 |
| nhttp            | bun     | 236,206.12  | 312,813.69 | 203,704.53 | 192,100.14 |
| bun-web-standard | bun     | 231,064.037 | 285,526.47 | 212,470.41 | 195,195.23 |
| wobe             | bun     | 218,277.05  | 234,942.22 | 226,901.27 | 192,987.66 |
| hono             | bun     | 184,819.54  | 233,892.49 | 180,506.67 | 140,059.46 |
| baojs            | bun     | 166,025.157 | 198,405.94 | 161,972.62 | 137,696.91 |
| nbit             | bun     | 152,888.977 | 218,683.39 | 157,367.59 | 82,615.95  |
| hono             | deno    | 139,968.84  | 178,772.81 | 145,549.76 | 95,583.95  |
| fast             | deno    | 103,415.337 | 123,510.33 | 104,731.4  | 82,004.28  |
| h3               | node    | 96,588.87   | 116,467.91 | 90,709.32  | 82,589.38  |
| cheetah          | deno    | 79,026.897  | 135,775.66 | 59,112.25  | 42,192.78  |
| fastify          | bun     | 74,044.663  | 97,382.42  | 87,200.67  | 37,550.9   |
| fastify          | node    | 55,294.813  | 71,331.83  | 63,531.59  | 31,021.02  |
| oak              | deno    | 53,660.333  | 63,991.55  | 56,668.9   | 40,320.55  |
| hono             | node    | 42,494.44   | 61,742.02  | 54,953.13  | 10,788.17  |
| koa              | node    | 40,645.913  | 47,336.39  | 41,578.73  | 33,022.62  |
| express          | bun     | 37,476.36   | 42,578.32  | 37,060.56  | 32,790.2   |
| abc              | deno    | 28,240.927  | 39,723.91  | 32,811.86  | 12,187.01  |
| express          | node    | 16,652.3    | 17,777.67  | 16,818.97  | 15,360.26  |
| acorn            | deno    | 3,311.497   | 5,568.21   | 2,516.95   | 1,849.33   | 

See more detail in [results](https://github.com/SaltyAom/bun-http-framework-benchmark/tree/main/results)

## Notice

I highly recommended testing this benchmark on your machine yourself as performance in likely to vary between machine.
