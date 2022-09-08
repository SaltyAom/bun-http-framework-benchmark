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
- MacOS 12.5
- Bun 0.1.11
- Node 16.16.0

Tested at 8 Sep 21:30 (GMT+7)

## Results
These results are measure in req/s:

|  Framework       |  Get (/)    |  Params, query & header | Post JSON  |
| ---------------- | ----------- | ----------------------- | ---------- |
| baojs | 72,931.84 | 64,233.71 | 64,124.12 |
| bun-bakery | 78,797.11 | 64,957.72 | 60,506.55 |
| bun | 116,323.84 | 99,849.13 | 76,352.33 |
| colston | 84,805.69 | 78,746.62 | 77,262.01 |
| express | 13,439.17 | 10,882.66 | 10,438.75 |
| hono | 85,391.67 | 72,013.97 | 71,498.29 |
| hyperbun | 75,857.79 | 63,652.13 | 61,519.47 |
| kingworld | 110,856.65 | 90,162.33 | 70,585.47 |
| nbit | 75,431.68 | 63,363.92 | 61,284.29 |

## Notice
According to Bun 0.1.11 release note, seems like there are a performance different between Apple Silicon and x86_64 Linux.

On x86_64 Linux side, most benchmark catch up to KingWorld and Hono even surpass KingWorld in `Get (/)`, however on Apple Silicon tells the different story up above.

I highly recommended testing this benchmark on your machine yourself.
