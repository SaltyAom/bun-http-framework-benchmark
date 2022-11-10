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

Tested on 10 Nov 18:30 (GMT+7)

## Results
These results are measured in req/s:

|  Framework       |  Get (/)    |  Params, query & header | Post JSON  |
| ---------------- | ----------- | ----------------------- | ---------- |
| bagel | 67,613.08 | 53,796.41 | 56,772.19 |
| baojs | 101,368.95 | 88,603.55 | 47,188.34 |
| bun-bakery | 110,846.87 | 88,840.71 | 81,209.29 |
| bun | 146,878.26 | 118,326.64 | 98,611.11 |
| express | 24,472.89 | 24,013.47 | 5,852.41 |
| hono | 155,271.36 | 118,073.23 | 97,767.5 |
| hyperbun | 105,279.72 | 85,125.67 | 81,896.25 |
| kingworld | 161,842.48 | 136,831.51 | 98,682.99 |
| nbit | 96,028.45 | 82,250.84 | 79,728 |
| zarf | 64,224.93 | 66,515.67 | 66,753.26 |

## Notice
I highly recommended testing this benchmark on your machine yourself.
