# Bun HTTP Framework Benchmark
Compare throughput benchmarks from various Bun HTTP framework

Library/framework:
- bagel
- baojs
- buchta
- bun-bakery
- bun
- ~~kingworld~~ elysia
- express
- hono
- hyperbun
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
```typescript
bun run benchmark
```

Dump result will be available at `results/[benchmark-name].txt`

## Benchmark Condition
This benchmark is tested under the following condition:
- MacBook Pro 14' M1 Max 10 CPU Core, 32 GPU Core, 64GB of RAM
- MacOS 13.0.1
- Bun 0.3.0
- Node 18.6.0

Tested on 14 Dec 23:03 (GMT+7)

## Results
For results suffix with `-node` means that the framework is run in Node, otherwise is using Bun.

These results are measured in req/s:

|  Framework       |  Get (/)    |  Params, query & header | Post JSON  |
| ---------------- | ----------- | ----------------------- | ---------- |
| bagel | 63,474.05 | 50,853.85 | 54,069.09 |
| baojs | 88,414.41 | 80,647.95 | 79,613.88 |
| buchta | 120,720.37 | 99,249.85 | 78,116.05 |
| bun-bakery | 111,995.82 | 86,053.25 | 76,612.67 |
| bun | 139,402.32 | 116,682.16 | 94,440.85 |
| elysia | 154,621.76 | 127,704.25 | 91,991.75 |
| express | 23,009.95 | 22,612.06 | 207.02 |
| hono | 153,918.58 | 104,385.16 | 91,482.32 |
| hyperbun | 97,362.26 | 81,294.39 | 70,760.55 |
| nbit | 86,696.52 | 76,987.94 | 75,572.27 |
| zarf | 69,987.27 | 61,178.43 | 62,818.22 |

## Notice
I highly recommended testing this benchmark on your machine yourself.
