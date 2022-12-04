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
- Bun 0.2.2
- Node 18.6.0

Tested on 4 Dec 22:21 (GMT+7)

## Results
These results are measured in req/s:

|  Framework       |  Get (/)    |  Params, query & header | Post JSON  |
| ---------------- | ----------- | ----------------------- | ---------- |
| bagel | 65,376.59 | 52,728.26 | 55,837.97 |
| baojs | 95,180.04 | 86,313.79 | 86,143.23 |
| bun-bakery | 111,867.72 | 88,149.65 | 82,156.52 |
| bun | 143,474.42 | 120,181.69 | 97,914.37 |
| elysia | 162,225.46 | 139,780.89 | 98,668.38 |
| express | 23,835.44 | 23,717.24 | 5,771.06 |
| hono | 148,663.19 | 106,210.93 | 100,073.22 |
| hyperbun | 101,668.68 | 86,176.31 | 81,789.73 |
| nbit | 95,990.4 | 81,933.19 | 82,669.7 |
| zarf | 63,897.06 | 64,156.38 | 64,452.87 |

## Notice
I highly recommended testing this benchmark on your machine yourself.
