import {
	readdirSync,
	mkdirSync,
	existsSync,
	writeFileSync,
	appendFileSync,
	lstatSync
} from "fs"
import rimraf from "rimraf"
import kill from "kill-port"
import killPort from "kill-port"

// ? Not working
const blacklists = ["bunrest", "colston", "fastify", "fastify-node"]

const commands = [
	`bombardier --fasthttp -c 500 -d 10s http://localhost:3000/`,
	`bombardier --fasthttp -c 500 -d 10s http://localhost:3000/id/1?name=bun`,
	`bombardier --fasthttp -c 500 -d 10s -m POST -H 'Content-Type:application/json' -f ./scripts/body.json http://localhost:3000/json`
] as const

const catchNumber = /Reqs\/sec\s+(\d+[.|,]\d+)/m
const format = (value: any) => Intl.NumberFormat("en-US").format(value)

if (!existsSync("./results")) mkdirSync("./results")

const frameworks = readdirSync("src")
	.filter((a) => a.endsWith(".ts") || !a.includes("."))
	.map((a) => (a.includes(".") ? a.replace(".ts", "") : `${a}/index`))
	.filter((a) => !blacklists.includes(a))
	.sort()

const sleep = (s = 1) => new Promise((resolve) => setTimeout(resolve, s * 1000))

writeFileSync(
	"results/results.md",
	`
|  Framework       |  Get (/)    |  Params, query & header | Post JSON  |
| ---------------- | ----------- | ----------------------- | ---------- |
`
)

const main = async () => {
	for (const framework of frameworks) {
		const name = framework.replace("/index", "")

		console.log("\n", name)

		writeFileSync(`./results/${name}.txt`, "")
		appendFileSync("./results/results.md", `| ${name} `)

		let file: string

		file = existsSync(`./src/${framework}.ts`)
			? `src/${framework}.ts`
			: `src/${framework}.js`

		const runtime = framework.includes("-node") ? "ts-node" : "bun"
		console.log(" >", runtime, file, "\n")

		const server = Bun.spawn([runtime, file])

		// Wait 1 second for server to bootup
		await sleep()

		for (const command of commands) {
			appendFileSync(`./results/${name}.txt`, `${command}\n`)

			const { stdout } = Bun.spawnSync(command.split(" ") as any, {
				stdout: "pipe"
			})

			const res = stdout?.toString()!
			console.log(res)

			const results = catchNumber.exec(res)
			if (!results?.[1]) continue

			appendFileSync(`./results/${name}.txt`, results + "\n")
			appendFileSync("./results/results.md", `| ${format(results[1])} `)
		}

		appendFileSync("./results/results.md", `|\n`)

		await server.kill()

		await sleep()
	}
}

main()
