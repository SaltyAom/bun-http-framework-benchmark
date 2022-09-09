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

Tested at 9 Sep 11:53 (GMT+7)

## Results
These results are measure in req/s:

|  Framework       |  Get (/)    |  Params, query & header | Post JSON  |
| ---------------- | ----------- | ----------------------- | ---------- |
| baojs | 77,315.06 | 62,364.05 | 63,084.34 |
| bun-bakery | 91,180.35 | 65,893 | 58,801.59 |
| bun | 156,041.64 | 122,409.64 | 81,232.31 |
| colston | 76,274.14 | 91,699.19 | 45,671.05 |
| express | 9,457.48 | 8,869.25 | 9,386.85 |
| hono | 146,318.89 | 117,721.33 | 83,584.14 |
| hyperbun | 82,673.32 | 63,710.56 | 61,401.5 |
| kingworld | 148,972.4 | 118,299.44 | 83,981.31 |
| nbit | 83,789.09 | 63,297.7 | 61,279.01 |

## Notice
According to Bun 0.1.11 release note, seems like there are a performance different between Apple Silicon and x86_64 Linux.

On x86_64 Linux side, most benchmark catch up to KingWorld and Hono even surpass KingWorld in `Get (/)`, however on Apple Silicon tells the different story up above.

I highly recommended testing this benchmark on your machine yourself.
