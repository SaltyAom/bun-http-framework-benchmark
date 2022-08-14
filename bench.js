import {
    readdirSync,
    mkdirSync,
    existsSync,
    writeFileSync,
    appendFileSync
} from 'fs'
import { $ } from 'zx'

const blacklists = [
    // ? Not working
    'colston'
]

const commands = [
    `wrk -t 4 -c 250 -d 10s http://localhost:3000/`,
    `wrk -t 4 -c 250 -d 10s http://localhost:3000/id/1?framework=bun`,
    `wrk -t 4 -c 250 -d 10s -s ./scripts/json.lua http://localhost:3000/json`
]

if (!existsSync('./results')) mkdirSync('./results')

const frameworks = readdirSync('src')
    .filter((a) => a.endsWith('.ts') || !a.includes('.'))
    .map((a) => (a.includes('.') ? a.replace('.ts', '') : `${a}/index`))
    .filter(a => !blacklists.includes(a))

const sleep = (s = 1) => new Promise((resolve) => setTimeout(resolve, s * 1000))

for (const framework of frameworks) {
    const name = framework.replace("/index", "")

    console.log(`\n${name}\n`)
    writeFileSync(`./results/${name}.txt`, '')

    const server = $`ENV=production bun src/${framework}.ts`.quiet().nothrow()
    await sleep()

    for (const command of commands) {
        appendFileSync(`./results/${name}.txt`, `${command}\n`)
        appendFileSync(`./results/${name}.txt`, `` + await $([command]))
        appendFileSync(`./results/${name}.txt`, `\n`)
    }

    await server.kill()
}
