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
| bagel | 65,990.49 | 52,261.97 | 55,033.64 |
| baojs | 97,228.39 | 86,017.1 | 46,983.79 |
| bun-bakery | 106,163.28 | 86,167.03 | 79,104.04 |
| bun | 145,521.27 | 117,095.06 | 97,545.69 |
| colston | 7,066.98 | 99,420.42 | 8,749.52 |
| express | 24,353.45 | 23,849.65 | 5,789.56 |
| hono | 151,657.74 | 112,963.19 | 97,902.92 |
| hyperbun | 101,917.94 | 82,720.89 | 78,611.05 |
| kingworld | 156,718.7 | 134,351.27 | 95,678.08 |
| nbit | 90,357.97 | 79,119.93 | 79,460.31 |
| zarf | 38,533.73 | 38,520.33 | 38,289.43 |

## Notice
I highly recommended testing this benchmark on your machine yourself.
