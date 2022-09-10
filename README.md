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

Tested at 10 Sep 11:39 (GMT+7)

## Results
These results are measure in req/s:

|  Framework       |  Get (/)    |  Params, query & header | Post JSON  |
| ---------------- | ----------- | ----------------------- | ---------- |
| baojs | 79,039.79 | 64,390.08 | 63,612.61 |
| bun-bakery | 92,489.34 | 71,882.32 | 60,114.73 |
| bun | 158,116.81 | 121,624.6 | 84,667.76 |
| colston | 76,363.79 | 92,022.65 | 44,900.53 |
| express | 8,637.87 | 10,141.52 | 9,316.94 |
| hono | 149,815.31 | 118,931.51 | 82,321.68 |
| hyperbun | 82,922.49 | 63,581.31 | 61,915.9 |
| kingworld | 150,616.04 | 125,181.35 | 86,086.5 |
| nbit | 81,017.57 | 64,816.81 | 59,818.97 |

## Notice
According to Bun 0.1.11 release note, seems like there are a performance different between Apple Silicon and x86_64 Linux.

On x86_64 Linux side, most benchmark catch up to KingWorld and Hono even surpass KingWorld in `Get (/)`, however on Apple Silicon tells the different story up above.

I highly recommended testing this benchmark on your machine yourself.
