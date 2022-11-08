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

Tested at 9 Nov 02:13 (GMT+7)

## Results
These results are measure in req/s:

|  Framework       |  Get (/)    |  Params, query & header | Post JSON  |
| ---------------- | ----------- | ----------------------- | ---------- |
| bagel | 66,442.46 | 52,649.11 | 55,966.25 |
| baojs | 97,045.48 | 85,517.03 | 46,901.69 |
| bun-bakery | 109,206.02 | 85,757.58 | 79,467.93 |
| bun | 142,184.6 | 118,742.32 | 95,263.88 |
| express | 24,381.2 | 23,849.61 | 5,877.53 |
| hono | 145,960.23 | 110,642.58 | 96,388.21 |
| hyperbun | 99,282.05 | 82,630.29 | 79,011.2 |
| kingworld | 149,457.16 | 132,395.46 | 94,794.84 |
| nbit | 91,184.47 | 79,212.58 | 78,558.39 |
| zarf | 62,385.61 | 64,089.92 | 64,422.83 |

## Notice
I highly recommended testing this benchmark on your machine yourself.
