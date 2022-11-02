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

Tested at 2 Nov 21:58 (GMT+7)

## Results
These results are measure in req/s:

|  Framework       |  Get (/)    |  Params, query & header | Post JSON  |
| ---------------- | ----------- | ----------------------- | ---------- |
| baojs | 98,584.22 | 86,683.12 | 46,710.95 |
| bun-bakery | 109,227.04 | 84,976.17 | 80,374.95 |
| bun | 141,815.88 | 115,862.23 | 96,142.38 |
| colston | 7,789.48 | 97,517.83 | 10,773.15 |
| express | 24,395.13 | 23,904.23 | 5,684.92 |
| hono | 147,160.72 | 113,641.63 | 99,204.79 |
| hyperbun | 101,960.38 | 83,672.51 | 78,246.22 |
| kingworld | 153,323.52 | 133,298.88 | 96,309.46 |
| nbit | 91,207.94 | 78,692.62 | 78,205.57 |

## Notice
I highly recommended testing this benchmark on your machine yourself.
