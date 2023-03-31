import {
	readdirSync,
	mkdirSync,
	existsSync,
	writeFileSync,
	appendFileSync,
	lstatSync,
	readFileSync
} from "fs"
import rimraf from "rimraf"
import { Subprocess } from "bun"

import { cpus } from "os"

const threads = cpus().length - 1

const sleep = (s = 0.5) =>
	new Promise((resolve) => setTimeout(resolve, s * 1000))

const spawnServer = (framework: string, file: string) => {
	const runtime = framework.includes("-node") ? "ts-node" : "bun"
	const cmd = [...runtime.split(" "), file]

	console.log(" >", cmd.join(" "))
	console.log(" Using", threads, "threads\n")

	if (runtime === "ts-node")
		return [
			Bun.spawn({
				cmd,
				env: {
					ENV: "production",
					NODE_ENV: "production",
					cwd: process.cwd()
				}
			})
		]

	return new Array(threads).fill(null).map(() => {
		return Bun.spawn({
			cmd,
			env: {
				ENV: "production",
				NODE_ENV: "production",
				cwd: process.cwd()
			}
		})
	})
}

const killServer = async (process: Subprocess[]) => {
	await Promise.all(process.map((x) => x.kill()))

	await sleep()

	await Bun.spawn({
		cmd: ["npm", "kill-port"]
	})

	await sleep()
}

// ? Not working
const blacklists = ["bagel", "bunrest", "colston", "fastify", "fastify-node"]

const commands = [
	["bash", "./get.sh"],
	["bash", "./query.sh"],
	["bash", "./body.sh"]
]

const catchNumber = /Reqs\/sec\s+(\d+[.|,]\d+)/m
const format = (value: string) =>
	Intl.NumberFormat("en-US").format(value as any)

const main = async () => {
	if (!existsSync("./results")) mkdirSync("./results")

	const frameworks = readdirSync("src")
		.filter((a) => a.endsWith(".ts") || !a.includes("."))
		.map((a) => (a.includes(".") ? a.replace(".ts", "") : `${a}/index`))
		.filter((a) => !blacklists.includes(a))
		.filter((a) => !a.includes("-node"))
		.sort()

	writeFileSync(
		"results/results.md",
		`
|  Framework       |  Get (/)    |  Params, query & header | Post JSON  |
| ---------------- | ----------- | ----------------------- | ---------- |
`
	)

	for (const framework of frameworks) {
		const name = framework.replace("/index", "")

		console.log("\n", name)

		writeFileSync(`./results/${name}.txt`, "")
		appendFileSync("./results/results.md", `| ${name} `)

		let file

		file = existsSync(`./src/${framework}.ts`)
			? `src/${framework}.ts`
			: `src/${framework}.js`

		const server = spawnServer(framework, file)

		// Wait 1 second for server to bootup
		await sleep()

		for (const command of commands) {
			appendFileSync(`./results/${name}.txt`, `${command}\n`)

			const { stdout } = Bun.spawnSync({
				cmd: command as any,
				stdout: "pipe",
				cwd: "./scripts"
			})

			const res = stdout?.toString()!
			console.log(res)

			const results = catchNumber.exec(res)
			if (!results?.[1]) continue

			appendFileSync(`./results/${name}.txt`, results + "\n")
			appendFileSync("./results/results.md", `| ${format(results[1])} `)
		}

		appendFileSync("./results/results.md", `|\n`)

		killServer(server)
	}
}

const toNumber = (a: string) => +a.replaceAll(",", "")

const arrange = () => {
	const table = readFileSync("results/results.md", {
		encoding: "utf-8"
	})

	const orders = []

	const [_, title, divider, ...rows] = table.split("\n")
	for (const row of rows) {
		const data = row
			.replace(/\ /g, "")
			.split("|")
			.filter((a) => a)

		if (data.length !== 4) continue

		const [name, c1, c2, c3] = data
		orders.push({
			name,
			total: toNumber(c1) + toNumber(c2) + toNumber(c3),
			row
		})
	}

	console.log(
		[
			title,
			divider,
			...orders.sort((a, b) => b.total - a.total).map((a) => a.row)
		].join("\n")
	)

	writeFileSync(
		"results/results.md",
		[
			title,
			divider,
			...orders.sort((a, b) => b.total - a.total).map((a) => a.row)
		].join("\n"),
		{
			encoding: "utf-8"
		}
	)
}

main().then(arrange)
