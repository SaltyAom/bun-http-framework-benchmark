# Bun HTTP Framework Benchmark
Compare throughput benchmark from various Bun HTTP framework

Library / framework:
- Bun Bakery
- Baojs
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

Dump result will be avilable at `scripts/[benchmark-name].txt`

## Benchmark Condition
This benchmark is tested under the following condition:
- MacBook Pro 14' M1 Max 10 CPU Core, 32 GPU Core, 64GB of RAM
- MacOS 12.5
- Bun 0.1.8
- Node 16.16.0

Tested at 14 Aug 21:30 (GMT+7)

## Results
This results are measure in req/s:

|  Framework       |  Get (/)    |  Named params & set header | Post JSON  |
| ---------------- | ----------- | -------------------------- | ---------- |
|  Baojs           |  39298.72   |  37325.27                  | 45915.79   |
|  Bun Bakery      |  41279.78   |  34687.51                  | 46328.78   |
|  Hono            |  55211.26   |  48159.49                  | 55556.72   |
|  KingWorld       |  173102.23  |  128737.63                 | 58687.61   |
|  nbit            |  56635.13   |  49760.46                  | 50045.43   |

## FAQ
- Why does KingWorld performance drop on JSON?
    - As the creator of KingWorld, I can admit that KingWorld cheat a bit. Bun currently has [async-await performance issue](https://github.com/oven-sh/bun/issues/567#issuecomment-1204756323), KingWorld try its best to avoid it, but parsing request's body absolutely required to use await otherwise it's required to compile to es5 (which isn't a good trade-off), so the performance drop there.
    - So in the future, once the issue is solved, you can expected to see all the framework performance improvement by a lot.
