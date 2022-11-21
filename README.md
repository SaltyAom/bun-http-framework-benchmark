# Bun HTTP Framework Benchmark
Compare throughput benchmarks from various Bun HTTP framework

Library/framework:
- bagel
- baojs
- bun
- bun
- express
- hono
- hyperbun
- kingworld
- nbit
- zarf

Test method:
Throughput
1. Get (/)
    - [GET] `/`
    - Return `hi` in plain text
2. Params, query & header
    - [GET] `/id/:id`
    - Extract path params, query and header.
    - For this benchmark, the request URL will be send as: `/id/1?name=bun`
    - Set `x-powered-by` to `benchmark`
    - Expected response: **"1 bun"** (`${id} ${query}`)
3. Post JSON
    - [POST] `/json`
    - Mirror body to response
    - For the benchmark, the request body will be sent as: `{ "hello": "world" }`
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

Dump result will be available at `results/[benchmark-name].txt`

## Benchmark Condition
This benchmark is tested under the following condition:
- MacBook Pro 14' M1 Max 10 CPU Core, 32 GPU Core, 64GB of RAM
- MacOS 13.0.1
- Bun 0.2.2
- Node 18.6.0

Tested on 21 Nov 14:38 (GMT+7)

## Results
These results are measured in req/s:

|  Framework       |  Get (/)    |  Params, query & header | Post JSON  |
| ---------------- | ----------- | ----------------------- | ---------- |
| bagel | 68,337.97 | 53,860.69 | 56,681.34 |
| baojs | 99,927.08 | 88,485.89 | 48,563.31 |
| bun-bakery | 111,250.95 | 87,910.84 | 81,630.4 |
| bun | 147,788.58 | 122,512.9 | 99,801.68 |
| express | 24,366.45 | 24,062.24 | 6,172.58 |
| hono | 152,603.97 | 112,658.48 | 99,095.03 |
| hyperbun | 102,351.23 | 85,179.63 | 80,727.59 |
| kingworld | 163,391.57 | 139,697.7 | 99,898.95 |
| nbit | 95,847.99 | 80,004.54 | 80,245.9 |
| zarf | 63,771.45 | 65,605.83 | 66,433.63 |

## Notice
I highly recommended testing this benchmark on your machine yourself.
