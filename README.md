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
- ~~kingworld~~ elysia
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
- Bun 0.3.0
- Node 18.6.0

Tested on 7 Dec 22:14 (GMT+7)

## Results
These results are measured in req/s:

|  Framework       |  Get (/)    |  Params, query & header | Post JSON  |
| ---------------- | ----------- | ----------------------- | ---------- |
| bagel | 66,959.11 | 52,829.93 | 55,867.55 |
| baojs | 98,521.43 | 88,810.08 | 88,340.4 |
| bun-bakery | 113,625.37 | 84,459.79 | 81,223.79 |
| bun | 146,678.85 | 119,559.35 | 101,705.15 |
| elysia | 164,312.53 | 142,176.17 | 100,339.16 |
| express | 23,935.97 | 23,422.17 | 6,193.47 |
| hono | 152,975.02 | 113,652.89 | 100,156.69 |
| hyperbun | 102,795.28 | 83,575.15 | 81,623.81 |
| nbit | 95,232.87 | 81,176.7 | 81,606.5 |
| zarf | 64,669.1 | 65,910.63 | 66,778.14 |

## Notice
I highly recommended testing this benchmark on your machine yourself.
