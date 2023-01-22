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
import { $ } from "zx"

// ? Not working
const blacklists = ["bunrest", "colston", "fastify"]

const commands = [
	`bombardier --fasthttp -c 500 -d 10s http://localhost:3000/`,
	`bombardier --fasthttp -c 500 -d 10s http://localhost:3000/id/1?name=bun`,
	`bombardier --fasthttp -c 500 -d 10s -m POST -H 'Content-Type: application/json' -f ./scripts/body.json http://localhost:3000/json`
]

const catchNumber = /Reqs\/sec\s+(\d+[.|,]\d+)/m
const format = (value) => Intl.NumberFormat("en-US").format(value)

const main = async () => {
	if (!existsSync("./results")) mkdirSync("./results")

	const frameworks = readdirSync("src")
		.filter((a) => a.endsWith(".ts") || !a.includes("."))
		.map((a) => (a.includes(".") ? a.replace(".ts", "") : `${a}/index`))
		.filter((a) => !blacklists.includes(a))
		.sort()

	const sleep = (s = 1) =>
		new Promise((resolve) => setTimeout(resolve, s * 1000))

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

		const runtime = framework.includes("-node") ? "npm run ts-node" : "bun"
		console.log(" >", runtime, file, "\n")

		const server = $([`${runtime} ${file}`])
			.quiet()
			.nothrow()

		// Wait 1 second for server to bootup
		await sleep()

		for (const command of commands) {
			appendFileSync(`./results/${name}.txt`, `${command}\n`)

			const res = (await $([command]).nothrow()) + ""

			const results = catchNumber.exec(res)
			if (!results?.[1]) continue

			appendFileSync(`./results/${name}.txt`, results + "\n")
			appendFileSync("./results/results.md", `| ${format(results[1])} `)
		}

		appendFileSync("./results/results.md", `|\n`)

		await server.kill()

		await sleep()

		await $`npm kill-port`.nothrow().quiet()
	}
}

const toNumber = (a) => +a.replaceAll(",", "")

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
