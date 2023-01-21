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
const blacklists = ["bunrest", "colston", "fastify"]

const commands = [
	`./scripts/get.sh`,
	`./scripts/query.sh`,
	`./scripts/body.sh`
] as const

const catchNumber = /Reqs\/sec\s+(\d+[.|,]\d+)/m
const format = (value: any) => Intl.NumberFormat("en-US").format(value)

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

			const { stdout } = Bun.spawnSync(["bash", command], {
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

		try {
			if (
				(await fetch("http://localhost:3000/").then(
					(r) => r.status
				)) === 200
			)
				await Bun.spawn(["npm", "run", "kill-port"])
		} catch (error) {
			// nothing
		}
	}
}

const toNumber = (a: string) => +a.replaceAll(",", "")

const arrange = async () => {
	const table = await Bun.file("results/results.md").text()

	const orders: Array<{
		name: string
		total: number
		row: string
	}> = []

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

	await Bun.write(
		"results/results.md",
		[
			title,
			divider,
			...orders.sort((a, b) => b.total - a.total).map((a) => a.row)
		].join("\n")
	)
}

main().then(arrange)
