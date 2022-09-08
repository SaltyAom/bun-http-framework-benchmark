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
| baojs | 93,822.16 | 80,189.17 | 68,924.51 |
| bun-bakery | 95,636.64 | 70,564.91 | 63,660.25 |
| bun | 160,406.3 | 124,572.35 | 85,950.35 |
| colston | 101,509.65 | 93,351.93 | 94,146.86 |
| express | 8,294.47 | 9,978.57 | 9,541.21 |
| hono | 114,993.72 | 81,577.65 | 80,241.51 |
| hyperbun | 82,449.16 | 67,345.61 | 64,635.53 |
| kingworld | 143,645.87 | 108,176.89 | 78,006.25 |
| nbit | 83,789.16 | 65,998.48 | 62,466.38 |

## Notice
According to Bun 0.1.11 release note, seems like there are a performance different between Apple Silicon and x86_64 Linux.

On x86_64 Linux side, most benchmark catch up to KingWorld and Hono even surpass KingWorld in `Get (/)`, however on Apple Silicon tells the different story up above.

I highly recommended testing this benchmark on your machine yourself.
