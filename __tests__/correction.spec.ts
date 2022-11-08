import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'bun:test'
import { readdirSync } from 'fs'
import { resolve } from 'path'

import { spawn, type Subprocess } from 'bun'

const startup = (ms = 5000) => new Promise((resolve) => setTimeout(resolve, ms))

const blacklists = ['bunrest', 'colston', 'fastify']

const frameworks = readdirSync(resolve('src'))
    .filter((a) => a.endsWith('.ts') || !a.includes('.'))
    .map((a) => (a.includes('.') ? a.replace('.ts', '') : `${a}/index`))
    .filter((a) => !blacklists.includes(a))

// ? Not usable atm (bun 0.2.2)
// ! Blocking on: https://github.com/oven-sh/bun/issues/1462
describe('correctness', async () => {
    for (const framework of ['kingworld']) {
        const server = Bun.spawn({
            cmd: ['bun', `src/${framework}.ts`],
            env: {
                ENV: 'production'
            }
        })

        await startup(100)

        let ops: Promise<void>[] = []

        const wrap = (
            executor: (
                resolve: (value: void) => void | Promise<void>
            ) => Promise<void>
        ): void => {
            ops.push(new Promise(executor))
        }

        it('[GET /]: return hi in plain/text', () => {
            wrap(async (resolve) => {
                const res = await fetch('http://localhost:3000/')
                expect(await res.text()).toBe('Hi')

                resolve()
            })
        })

        it('[GET /id/:id]: set header and return params and query', async () => {
            const res = await fetch('http://localhost:3000/id/1?name=bun')

            expect(res.headers.get('x-powered-by')).toBe('benchmark')
            expect(await res.text()).toBe('1 bun')
        })

        it('[POST /json]: mirror json result', () =>
            wrap(async () => {
                const body = JSON.stringify({
                    hello: 'world'
                })

                const res = await fetch('http://localhost:3000/json', {
                    method: 'POST',
                    body,
                    headers: {
                        'content-type': 'application/json',
                        'content-length': body.length.toString()
                    }
                })

                expect(res.headers.get('content-type')).toBe('application/json')
                expect(await res.text()).toBe(body)
            }))
    }
})
