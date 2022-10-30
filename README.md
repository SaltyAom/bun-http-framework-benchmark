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

Tested at 30 Oct 23:33 (GMT+7)

## Results
These results are measure in req/s:

| baojs | 93,524.25 | 82,983.52 | 47,083.92 |
| bun-bakery | 107,496.18 | 86,055.31 | 79,114.97 |
| bun | 131,526.21 | 109,468.16 | 99,372.31 |
| colston | 8,045.15 | 98,689.24 | 11,504.86 |
| express | 24,759 | 24,424 | 5,744.84 |
| hono | 148,692.32 | 118,088.39 | 98,541.17 |
| hyperbun | 100,929.28 | 83,005.48 | 80,835.21 |
| kingworld | 157,739.24 | 133,482.8 | 98,639.97 |
| nbit | 92,429.39 | 81,505.91 | 78,957.81 |

## Notice
I highly recommended testing this benchmark on your machine yourself.
