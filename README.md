# Bun HTTP Framework Benchmark

Compare throughput benchmarks from various Bun HTTP framework

Test method: Average throughput

1. Ping
    - Request to [GET] `/`
    - Return `hi`
    - Headers must contains text `Content-Type: text/plain`, additional context is acceptable eg. `Content-Type: text/plain; charset=utf-8`
2. Query
    - Request to [GET] `/id/:id`
    - Extract path parameter, query string and setting headers.
    - For this benchmark, the request URL will be send as: `/id/1?name=bun`
    - Headers must contains `x-powered-by` to `benchmark`
    - Expected response: **"1 bun"** (`${id} ${query}`)
        - You **MUST NOT use hardcode string or index** to extract querystring.
        - In a real-world situation, there's no enforcement that the request will follow the specification, using hardcode index to extract `name=bun` querystring will be prone to error.
        - To test if it pass the requirement, the implementation should be able to extract querystring **dynamically** (please treat the value of 'name=bun' can be any value beside 'bun', for example 'alice', 'hina'), which means that the same code should be able to extract querystring, for example:
        - `/id/1?name=bun&id=1` -> should return `1 bun` not `1 bun&id=1`
        - `/id/1?id=1` -> should return `1 `
        - Query beside `name` maybe not need to be extracted and is optional
    - Headers must contains text `Content-Type: text/plain`, additional context is acceptable eg. `Content-Type: text/plain; charset=utf-8`
3. Body
    - [POST] `/json`
    - Mirror body to response
    - For the benchmark, the request body will be sent as: `{ "hello": "world" }`
    - Expected response: `{ "hello": "world" }`
    - Headers must contains text `Content-Type: application/json`, additional context is acceptable eg. `Content-Type: application/json; charset=utf-8`.

# Prerequistes

-   [bombardier](https://github.com/codesenberg/bombardier)
-   Nodejs
-   Deno
-   Bun

# Run Test

```typescript
bun benchmark
```

Dump result will be available at `results/[benchmark-name].txt`

## Benchmark Condition

This benchmark is tested under the following condition:

-   Windows 11 under WSL Debian
-   Intel I7-13700K, DDR5 32GB 5600MHz
-   Windows 11 22H2 build 22621.1778
-   Debian GNU/Linux 11 (Bullseye), kernel: 5.15.90.1-microsoft-standard-WSL2
-   Bun 1.0.0
-   Node 18.16.0
-   Deno 1.36.0

Tested on 8 Sep 2023 23:39 (GMT+7)

## Results

For results suffix with `-node` means that the framework is run in Node, otherwise is using Bun.

These results are measured in req/s:

| Framework              | Average     | Get (/)    | Params, query & header | Post JSON  |
| ---------------------- | ----------- | ---------- | ---------------------- | ---------- |
| uws (node)             | 369,192.103 | 457,538.99 | 389,308.63             | 260,728.69 |
| stricjs (bun)          | 268,422.07  | 323,535.76 | 262,470.15             | 219,260.3  |
| bun (bun)              | 262,250.81  | 325,012.5  | 238,600.42             | 223,139.51 |
| elysia (bun)           | 261,538.61  | 321,378.82 | 248,866.5              | 214,370.51 |
| vixeny (bun)           | 260,097.983 | 321,361.76 | 250,442.26             | 208,489.93 |
| hyper-express (node)   | 241,177.05  | 350,373.13 | 274,099.12             | 99,058.9   |
| hono (bun)             | 238,294.85  | 295,794.19 | 227,806.78             | 191,283.58 |
| bun-web-standard (bun) | 233,734.623 | 282,952.77 | 220,206.67             | 198,044.43 |
| nhttp (bun)            | 232,273.04  | 300,289.39 | 213,002.07             | 183,527.66 |
| hyperbun (bun)         | 162,952.447 | 218,591.35 | 158,992.25             | 111,273.74 |
| nbit (bun)             | 149,914.61  | 190,477.31 | 147,009.36             | 112,257.16 |
| baojs (bun)            | 148,991.963 | 187,599.82 | 144,528.44             | 114,847.63 |
| hono (deno)            | 132,527.407 | 167,513.6  | 137,757.28             | 92,311.34  |
| h3 (node)              | 109,805.423 | 134,438.55 | 97,886.93              | 97,090.79  |
| fast (deno)            | 94,872.417  | 111,352.95 | 94,498.72              | 78,765.58  |
| cheetah (deno)         | 65,816.437  | 123,169.82 | 56,127.76              | 18,151.73  |
| fastify (node)         | 65,813.137  | 78,048.68  | 67,553.99              | 51,836.74  |
| oak (deno)             | 49,623.603  | 58,177.14  | 50,212.64              | 40,481.03  |
| abc (deno)             | 42,806.143  | 54,345.39  | 45,928.65              | 28,144.39  |
| koa (node)             | 39,195.18   | 45,212.34  | 40,435.12              | 31,938.08  |
| express (bun)          | 29,432.237  | 38,914.36  | 33,669.54              | 15,712.81  |
| hapi (node)            | 28,066.047  | 42,783.67  | 15,394.81              | 26,019.66  |
| adonis (node)          | 23,047.5    | 22,368.91  | 21,316.67              | 25,456.92  |
| express (node)         | 16,791.037  | 18,300.92  | 17,711.03              | 14,361.16  |
| hono (node)            | 15,607.28   | 17,964.72  | 16,495.52              | 12,361.6   |
| nest (node)            | 15,139.233  | 17,054.97  | 15,822.37              | 12,540.36  |
| acorn (deno)           | 3,217.67    | 5,340.93   | 2,452.29               | 1,859.79   |

Crash:
| Framework              | Average     | Get (/)    | Params, query & header | Post JSON  |
| ---------------------- | ----------- | ---------- | ---------------------- | ---------- |
| express (bun) | 512,117.39 | 513,848.37 | 511,647.49 | 510,856.31 |
| cheetah (deno) | 300,995.98 | 507,117.96 | 378,810.25 | 17,059.73 |

See more detail in [results](https://github.com/SaltyAom/bun-http-framework-benchmark/tree/main/results)

## Notice

I highly recommended testing this benchmark on your machine yourself as performance in likely to vary between machine.
