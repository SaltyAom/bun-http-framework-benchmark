# Bun HTTP Framework Benchmark
Compare throughput benchmark from various Bun HTTP framework

Library / framework:
- Bun Bakery
- Baojs
- Bunrest (named parameter isn't implemented)
- Colston (not working at the moment, need help)
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
- [wrk](https://github.com/wg/wrk)
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
- Bun 0.1.8
- Node 16.16.0

Tested at 14 Aug 21:30 (GMT+7)

## Results
These results are measure in req/s:

|  Framework       |  Get (/)    |  Params, query & header | Post JSON  |
| ---------------- | ----------- | ----------------------- | ---------- |
| baojs | 66,424.55 | 54,127.05 | 53,687.18 |
| bun-bakery | 61,187.81 | 51,031.74 | 53,565.63 |
| hono | 75,722.56 | 60,065.82 | 59,024.78 |
| hyperbun | 68,397.27 | 55,832.92 | 53,499.66 |
| kingworld | 173,653.22 | 153,832.96 | 70,095.04 |
| nbit | 63,838.51 | 53,545.44 | 50,620.68 |

## FAQ
- Why does KingWorld performance drop on JSON?
    - As the creator of KingWorld, I can admit that KingWorld cheat a bit. Bun currently has [async-await performance issue](https://github.com/oven-sh/bun/issues/567#issuecomment-1204756323),and KingWorld try its best to avoid it. But parsing request's body need to use await otherwise it's you need to compile to es5 (which isn't a good trade-off), so the performance drop there.
    - So in the future, once the issue is solved, you can expected to see all the framework performance improvement by a lot.
