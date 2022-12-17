# Bun HTTP Framework Benchmark
Compare throughput benchmarks from various Bun HTTP framework

Library/framework:
- bagel
- baojs
- buchta
- bun
- bun-bakery
- elysia ~~(previously kingworld)~~
- express
- express-node
- fastify-node
- hono
- hyperbun
- koa-node
- nbit
- nest-node
- zarf

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
- [bombardier](https://github.com/codesenberg/bombardier)
- Nodejs
- Bun

# Run Test
```typescript
bun run benchmark
```

Dump result will be available at `results/[benchmark-name].txt`

## Benchmark Condition
This benchmark is tested under the following condition:
- MacBook Pro 14' M1 Max 10 CPU Core, 32 GPU Core, 64GB of RAM
- MacOS 13.0.1
- Bun 0.3.0
- Node 18.6.0

Tested on 14 Dec 23:03 (GMT+7)

## Results
For results suffix with `-node` means that the framework is run in Node, otherwise is using Bun.

These results are measured in req/s:

|  Framework       |  Get (/)    |  Params, query & header | Post JSON  |
| ---------------- | ----------- | ----------------------- | ---------- |
| bagel | 63,289.84 | 51,377.51 | 53,471.66 |
| baojs | 89,682.84 | 81,275.86 | 79,269.86 |
| buchta | 118,695.4 | 98,472.42 | 76,084.4 |
| bun | 141,464.17 | 114,356.1 | 93,249.57 |
| bun-bakery | 110,296.27 | 86,974.38 | 75,201.47 |
| elysia | 152,746.59 | 126,075.27 | 127,666.64 |
| express | 23,032.38 | 22,765.45 | 21,568.72 |
| express-node | 18,150.6 | 17,696.28 | 16,803.6 |
| fastify-node | 65,015.7 | 60,087.82 | 31,430.84 |
| hono | 159,936.26 | 111,077.9 | 90,491.46 |
| hyperbun | 97,258.6 | 82,007 | 71,065.5 |
| koa-node | 47,652.99 | 42,900.22 | 37,349.66 |
| nbit | 87,356.79 | 77,745.53 | 65,873.92 |
| nest-node | 17,381.51 | 16,815.01 | 15,433.11 |
| zarf | 69,803.14 | 61,696.74 | 63,971.91 |

## Notice
I highly recommended testing this benchmark on your machine yourself.
