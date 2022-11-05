# Bun HTTP Framework Benchmark
Compare throughput benchmark from various Bun HTTP framework

Library / framework:
- Bun Bakery
- Baojs
- Bunrest (named parameter isn't implemented)
- Colston
- Express
- Hono
- Hyperbun
- KingWorld
- nbit

Test method:
Throughput
1. Get (/)
    - [GET] `/`
    - Return `hi` in plain text
2. Params, query & header
    - [GET] `/id/:id`
    - Extract path params, query and header.
    - For this benchmark, request url will be send as: `/id/1?name=bun`
    - Set `x-powered-by` to `benchmark`
    - Expected response: **"1 bun"** (`${id} ${query}`)
3. Post JSON
    - [POST] `/json`
    - Mirror body to response
    - For the benchmark, request body will be send as: `{ "hello": "world" }`
    - Expected response: `{ "hello": "world" }`

# Prerequistes
- [bombardier](https://github.com/codesenberg/bombardier)
- Nodejs
- Bun

# Run Test
Test is written in Node.js but spawn process is bun.

```typescript
npm run benchmark
```

Dump result will be avilable at `results/[benchmark-name].txt`

## Benchmark Condition
This benchmark is tested under the following condition:
- MacBook Pro 14' M1 Max 10 CPU Core, 32 GPU Core, 64GB of RAM
- MacOS 13.0
- Bun 0.2.2
- Node 18.6.0

Tested at 6 Nov 00:36 (GMT+7)

## Results
These results are measure in req/s:

|  Framework       |  Get (/)    |  Params, query & header | Post JSON  |
| ---------------- | ----------- | ----------------------- | ---------- |
| baojs | 98,780.27 | 86,822.65 | 47,472.23 |
| bun-bakery | 107,321.24 | 86,324.42 | 78,967.54 |
| bun | 145,752.68 | 120,198.11 | 97,103.57 |
| colston | 7,869.87 | 97,091.74 | 10,887.75 |
| express | 24,194.65 | 23,878.34 | 5,795.74 |
| hono | 145,906.11 | 113,248.28 | 97,343.83 |
| hyperbun | 102,737.4 | 85,386.94 | 80,265.63 |
| kingworld | 158,780.01 | 142,634.77 | 94,206.24 |
| nbit | 91,531.5 | 79,346.11 | 78,334.38 |

## Notice
I highly recommended testing this benchmark on your machine yourself.
