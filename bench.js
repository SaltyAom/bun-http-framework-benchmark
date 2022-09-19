import {
    readdirSync,
    mkdirSync,
    existsSync,
    writeFileSync,
    appendFileSync
} from 'fs'
import rimraf from 'rimraf'
import { $ } from 'zx'

// ? Not working
const blacklists = ['bunrest', 'fastify']

const commands = [
    `bombardier --fasthttp -c 500 -d 10s http://localhost:3000/`,
    `bombardier --fasthttp -c 500 -d 10s http://localhost:3000/id/1?name=bun`,
    `bombardier --fasthttp -c 500 -d 10s -m POST -H 'Content-Type: application/json' -f ./scripts/body.json http://localhost:3000/json`
]

const catchNumber = /Reqs\/sec\s+(\d+[.|,]\d+)/m
const format = Intl.NumberFormat('en-US').format

if (existsSync('./results')) rimraf.sync('./results')
mkdirSync('./results')

const frameworks = readdirSync('src')
    .filter((a) => a.endsWith('.ts') || !a.includes('.'))
    .map((a) => (a.includes('.') ? a.replace('.ts', '') : `${a}/index`))
    .filter((a) => !blacklists.includes(a))

const sleep = (s = 1) => new Promise((resolve) => setTimeout(resolve, s * 1000))

writeFileSync(
    'results/results.md',
    `
|  Framework       |  Get (/)    |  Params, query & header | Post JSON  |
| ---------------- | ----------- | ----------------------- | ---------- |
`
)

for (const framework of ['kingworld']) {
    const name = framework.replace('/index', '')
    console.log(`\n${name}\n`)

    writeFileSync(`./results/${name}.txt`, '')
    appendFileSync('./results/results.md', `| ${name} `)

    const server = $`ENV=production bun src/${framework}.ts`.quiet().nothrow()

    // Wait 1 second for server to bootup
    await sleep()

    for (const command of commands) {
        appendFileSync(`./results/${name}.txt`, `${command}\n`)

        const results = (await $([command])) + ''
        appendFileSync(`./results/${name}.txt`, results + '\n')
        appendFileSync(
            './results/results.md',
            `| ${format(catchNumber.exec(results)[1])} `
        )
    }

    appendFileSync('./results/results.md', `|\n`)

    await server.kill()
}
