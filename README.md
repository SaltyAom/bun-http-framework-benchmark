# Bun HTTP Framework Benchmark
Compare throughput benchmark from various Bun HTTP framework

Library / framework:
- Bun Bakery
- Baojs
- Bunrest (named parameter isn't implemented)
- Colston (not working at the moment, need help)
- Hono
- KingWorld
- nbit

Test method:
Throughput 
1. Get `/` and return plain/text 'hi'
2. Get `/id/:id` as `id/1?framework=bun`, set `x-powered-by` to `benchmark`, and return **"1 bun"** (`${id} ${query}`)
3. POST `/json` and return body of request, for this benchmark, expected to return `{ hello: "world" }`

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
| baojs | 40,884.31 | 40,007.58 | 49,989.9 |
| bun-bakery | 42,223.04 | 35,604.68 | 52,311.96 |
| hono | 54,624.27 | 47,902.83 | 57,572.24 |
| kingworld | 171,500.73 | 124,720.2 | 59,550.05 |
| nbit | 53,584.71 | 48,932.89 | 53,352.55 |

## FAQ
- Why does KingWorld performance drop on JSON?
    - As the creator of KingWorld, I can admit that KingWorld cheat a bit. Bun currently has [async-await performance issue](https://github.com/oven-sh/bun/issues/567#issuecomment-1204756323),and KingWorld try its best to avoid it. But parsing request's body need to use await otherwise it's you need to compile to es5 (which isn't a good trade-off), so the performance drop there.
    - So in the future, once the issue is solved, you can expected to see all the framework performance improvement by a lot.
