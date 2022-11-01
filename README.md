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

Tested at 2 Nov 00:19 (GMT+7)

## Results
These results are measure in req/s:

|  Framework       |  Get (/)    |  Params, query & header | Post JSON  |
| ---------------- | ----------- | ----------------------- | ---------- |
| baojs | 98,776.63 | 86,463.07 | 47,625.26 |
| bun-bakery | 104,347.5 | 86,458.27 | 80,232.19 |
| bun | 139,667.67 | 115,234.17 | 97,050.33 |
| colston | 7,908.99 | 98,435.3 | 10,862.38 |
| express | 24,596.89 | 24,270.72 | 5,658.98 |
| hono | 146,024.87 | 113,498.69 | 93,961.78 |
| hyperbun | 100,911.61 | 82,996.55 | 79,778.45 |
| kingworld | 158,066.51 | 133,893.73 | 97,814.52 |
| nbit | 89,283.32 | 79,103.26 | 78,968.81 |

## Notice
I highly recommended testing this benchmark on your machine yourself.
