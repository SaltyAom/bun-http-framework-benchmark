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
- MacOS 12.6
- Bun 0.2.0
- Node 16.16.0

Tested at 14 Oct 10:27 (GMT+7)

## Results
These results are measure in req/s:

|  Framework       |  Get (/)    |  Params, query & header | Post JSON  |
| ---------------- | ----------- | ----------------------- | ---------- |
| baojs | 89,815.61 | 78,893.78 | 73,613.71 |
| bun-bakery | 112,590.01 | 79,890.18 | 69,406.26 |
| bun | 163,705.35 | 129,364.36 | 89,723.65 |
| colston | 7,716.77 | 103,185.97 | 11,604.82 |
| express | 24,538.77 | 23,865.71 | 6,491.6 |
| hono | 186,835.8 | 138,642.78 | 93,240.68 |
| hyperbun | 97,856.71 | 74,648.01 | 68,810.79 |
| kingworld | 158,395.62 | 129,790.04 | 89,371.59 |
| nbit | 87,300.5 | 73,024.87 | 68,067.32 |

## Notice
On x86_64 Linux side, most benchmark catch up to KingWorld and Hono even surpass KingWorld in `Get (/)`, however on Apple Silicon tells the different story up above.

I highly recommended testing this benchmark on your machine yourself.
