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

Tested at 19 Sep 12:15 (GMT+7)

## Results
These results are measure in req/s:

|  Framework       |  Get (/)    |  Params, query & header | Post JSON  |
| ---------------- | ----------- | ----------------------- | ---------- |
| baojs | 94,229.05 | 77,841.57 | 69,642.95 |
| bun-bakery | 99,329.63 | 70,180.41 | 65,470.18 |
| bun | 165,204.23 | 126,362.49 | 84,161.06 |
| colston | 76,188.43 | 94,466.66 | 44,357.32 |
| express | 24,792.92 | 24,235.19 | 14,013.7 |
| hono | 152,517.76 | 122,750.68 | 86,218.87 |
| hyperbun | 88,634.5 | 68,044.37 | 64,306.62 |
| kingworld | 154,504.36 | 120,663.79 | 85,774.19 |
| nbit | 86,007.09 | 66,869.51 | 65,011.4 |

## Notice
According to Bun 0.1.13 release note, seems like there are a performance different between Apple Silicon and x86_64 Linux.

On x86_64 Linux side, most benchmark catch up to KingWorld and Hono even surpass KingWorld in `Get (/)`, however on Apple Silicon tells the different story up above.

I highly recommended testing this benchmark on your machine yourself.
