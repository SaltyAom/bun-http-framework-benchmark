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
const blacklists = [
	// Crash
	"bun/bagel", 
	// Crash
	"bun/bunrest", 
	// Doesn't work properly
	"bun/colston", 
	// Problem with closing port
	"bun/fastify", 
	// Crash on 0.6.2
	"bun/zarf"
]

const commands = [
	`bombardier --fasthttp -c 500 -d 10s http://localhost:3000/`,
	`bombardier --fasthttp -c 500 -d 10s http://localhost:3000/id/1?name=bun`,
	`bombardier --fasthttp -c 500 -d 10s -m POST -H 'Content-Type: application/json' -f ./scripts/body.json http://localhost:3000/json`
]

const runtimeCommand = {
	node: "node",
	deno: "deno run --allow-net",
	bun: "bun"
}

const catchNumber = /Reqs\/sec\s+(\d+[.|,]\d+)/m
const format = (value) => Intl.NumberFormat("en-US").format(value)
const sleep = (s = 1) => new Promise((resolve) => setTimeout(resolve, s * 1000))

const secToMin = (seconds) =>
	Math.floor(seconds / 60) +
	":" +
	(seconds % 60 < 10 ? "0" : "") +
	(seconds % 60)

const main = async () => {
	if (!existsSync("./results")) mkdirSync("./results")

	let frameworks = readdirSync("src")
		.flatMap((runtime) => {
			if (!lstatSync(`src/${runtime}`).isDirectory()) return

			if (!existsSync(`results/${runtime}`))
				mkdirSync(`results/${runtime}`)

			return readdirSync(`src/${runtime}`)
				.filter(
					(a) =>
						a.endsWith(".ts") ||
						a.endsWith(".js") ||
						!a.includes(".")
				)
				.map((a) =>
					a.includes(".")
						? `${runtime}/` + a.replace(/.(j|t)s$/, "")
						: `${runtime}/${a}/index`
				)
				.filter((a) => !blacklists.includes(a))
		})
		.filter((x) => x)
		.sort()

	// Overwrite test here
	// frameworks = ['bun/elysia', 'node/adonis/index']

	console.log(`${frameworks.length} frameworks`)
	for (const framework of frameworks) console.log(`- ${framework}`)

	const estimateTime = frameworks.length * (commands.length * 10 + 1)

	console.log(`\nEstimate time: ${secToMin(estimateTime)} min`)

	writeFileSync(
		"results/results.md",
		`
|  Framework       | Average |  Get (/)    |  Params, query & header | Post JSON  |
| ---------------- | ------- | ----------- | ----------------------- | ---------- |
`
	)

	for (const target of frameworks) {
		let [runtime, framework, index] = target.split("/")
		if (index) framework += "/index"

		const name = framework.replace("/index", "")

		console.log("\n", name)
		console.log(" >", runtime, framework, "\n")

		writeFileSync(`./results/${runtime}/${name}.txt`, "")
		appendFileSync("./results/results.md", `| ${name} (${runtime}) `)

		const file = existsSync(`./src/${runtime}/${framework}.ts`)
			? `src/${runtime}/${framework}.ts`
			: `src/${runtime}/${framework}.js`

		console.log(`NODE_ENV=production ENV=production ${runtimeCommand[runtime]} ${file}`)

		const server = $([`NODE_ENV=production ENV=production ${runtimeCommand[runtime]} ${file}`])
			.quiet()
			.nothrow()

		// Wait 1 second for server to bootup
		await sleep()

		let content = ""
		const total = []

		for (const command of commands) {
			appendFileSync(`./results/${runtime}/${name}.txt`, `${command}\n`)

			const res = (await $([command]).nothrow()) + ""

			const results = catchNumber.exec(res)
			if (!results?.[1]) continue

			content += `| ${format(results[1])} `
			total.push(toNumber(results[1]))

			appendFileSync(`./results/${runtime}/${name}.txt`, results + "\n")
		}

		content =
			`| ${format(
				total.reduce((a, b) => +a + +b, 0) / commands.length
			)} ` +
			content +
			"|\n"

		appendFileSync("./results/results.md", content)

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

		if (data.length !== commands.length + 2) continue

		const [name, total] = data
		orders.push({
			name,
			total,
			row
		})
	}

	const content = [
		title,
		divider,
		...orders
			.map((x) => ({
				...x,
				total: toNumber(x.total)
			}))
			.sort((a, b) => b.total - a.total)
			.map((a) => a.row)
	].join("\n")

	console.log(content)

	writeFileSync("results/results.md", content, {
		encoding: "utf-8"
	})
}

main().then(arrange)
