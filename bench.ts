import {
	readdirSync,
	mkdirSync,
	existsSync,
	lstatSync,
	readFileSync,
	writeFileSync
} from 'fs'
import killPort from 'kill-port'
import { $, pathToFileURL } from 'bun'
import rimraf from 'rimraf'

const whitelists = []

// ? Not working
const blacklists = [
	// Not booting up in test
	'node/adonis/index',
	// Not setting content-type header for some reason
	'node/nest/index',
	// 'Not booting up in test'
	'node/hapi',
	// Body: Result not match
	'bun/xirelta',
	// Crash
	'bun/bagel',
	// Crash
	'bun/bunrest',
	// Doesn't work properly
	'bun/colston',
	// Crash on 0.6.2
	'bun/zarf',
	// Crash due to invalid npm version requirement of uWebSockets
	'deno/byte'
] as const

const time = 10

const commands = [
	`bombardier --fasthttp -c 500 -d ${time}s http://127.0.0.1:3000/`,
	`bombardier --fasthttp -c 500 -d ${time}s http://127.0.0.1:3000/id/1?name=bun`,
	`bombardier --fasthttp -c 500 -d ${time}s -m POST -H 'Content-Type:application/json' -f ./scripts/body.json http://127.0.0.1:3000/json`
] as const

const runtimeCommand = {
	node: 'node',
	deno: 'deno run --allow-net',
	bun: 'bun'
} as const

const catchNumber = /Reqs\/sec\s+(\d+[.|,]\d+)/m
const format = (value: string | number) =>
	Intl.NumberFormat('en-US').format(+value)
const sleep = (s = 1) => new Promise((resolve) => setTimeout(resolve, s * 1000))

const secToMin = (seconds: number) =>
	Math.floor(seconds / 60) +
	':' +
	(seconds % 60 < 10 ? '0' : '') +
	(seconds % 60)

// Fetch with retry
const retryFetch = (
	url: string,
	options?: RequestInit,
	time = 0,
	resolveEnd?: Function,
	rejectEnd?: Function
) => {
	return new Promise<Response>((resolve, reject) => {
		fetch(url, options)
			.then((a) => {
				if (resolveEnd) resolveEnd(a)

				resolve(a)
			})
			.catch((e) => {
				if (time > 7) {
					if (rejectEnd) rejectEnd(e)

					return reject(e)
				}
				setTimeout(
					() => retryFetch(url, options, time + 1, resolve, reject),
					200
				)
			})
	})
}

const test = async () => {
	try {
		const index = await retryFetch('http://127.0.0.1:3000/')

		if ((await index.text()) !== 'Hi')
			throw new Error('Index: Result not match')

		if (!index.headers.get('Content-Type')?.includes('text/plain'))
			throw new Error('Index: Content-Type not match')

		const query = await retryFetch('http://127.0.0.1:3000/id/1?name=bun')
		if ((await query.text()) !== '1 bun')
			throw new Error('Query: Result not match')

		if (!query.headers.get('Content-Type')?.includes('text/plain'))
			throw new Error('Query: Content-Type not match')

		if (!query.headers.get('X-Powered-By')?.includes('benchmark'))
			throw new Error('Query: X-Powered-By not match')

		const body = await retryFetch('http://127.0.0.1:3000/json', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				hello: 'world'
			})
		})

		if ((await body.text()) !== JSON.stringify({ hello: 'world' }))
			throw new Error('Body: Result not match')

		if (!body.headers.get('Content-Type')?.includes('application/json'))
			throw new Error('Body: Content-Type not match')
	} catch (error) {
		throw error
	}
}

const spawn = (target: string, title = true) => {
	let [runtime, framework, index] = target.split('/') as [
		keyof typeof runtimeCommand,
		string,
		string
	]
	if (index) framework += '/index'

	const name = framework.replace('/index', '')

	if (title) {
		console.log('\n', name)
		console.log(' >', runtime, framework, '\n')
	}

	const file = existsSync(`./src/${runtime}/${framework}.ts`)
		? `src/${runtime}/${framework}.ts`
		: `src/${runtime}/${framework}.js`

	const server = Bun.spawn({
		cmd: [...runtimeCommand[runtime].split(" "), file],
		env: {
			...Bun.env,
			NODE_ENV: 'production'
		}
	})

	return async () => {
		await server.kill()
		await sleep(0.3)

		try {
			await fetch('http://127.0.0.1:3000')
			await sleep(0.6)
			await fetch('http://127.0.0.1:3000')

			await killPort(3000)
		} catch {
			// Empty
		}
	}
}

try {
	if (lstatSync('results').isDirectory()) rimraf.sync('results')
} catch {}
mkdirSync('results')
writeFileSync('results/results.md', '')
const resultFile = Bun.file('results/results.md')
const result = resultFile.writer()

const main = async () => {
	try {
		await fetch('http://127.0.0.1:3000')
		await killPort(3000)
	} catch {
		// Empty
	}

	const runtimes = <string[]>[]

	if (!existsSync('./results')) mkdirSync('./results')

	let frameworks = readdirSync('src')
		.flatMap((runtime) => {
			if (!lstatSync(`src/${runtime}`).isDirectory()) return

			if (!existsSync(`results/${runtime}`))
				mkdirSync(`results/${runtime}`)

			return readdirSync(`src/${runtime}`)
				.filter(
					(a) =>
						a.endsWith('.ts') ||
						a.endsWith('.js') ||
						!a.includes('.')
				)
				.map((a) =>
					a.includes('.')
						? `${runtime}/` + a.replace(/.(j|t)s$/, '')
						: `${runtime}/${a}/index`
				)
				.filter(
					(a) =>
						!blacklists.includes(a as (typeof blacklists)[number])
				)
		})
		.filter((x) => x)
		.sort()

	// Overwrite test here
	frameworks = whitelists?.length ? whitelists : frameworks

	console.log(`${frameworks.length} frameworks`)
	for (const framework of frameworks) console.log(`- ${framework}`)

	console.log('\nTest:')
	for (const target of frameworks) {
		const kill = spawn(target!, false)

		let [runtime, framework] = target!.split('/')
		await sleep(0.1)

		if (runtimes.includes(runtime)) {
			const folder = `results/${runtime}`

			if (!lstatSync(folder).isDirectory()) rimraf(folder)
		}

		try {
			const kill = await test()

			console.log(`✅ ${framework} (${runtime})`)
		} catch (error) {
			console.log(`❌ ${framework} (${runtime})`)
			console.log('  ', (error as Error)?.message || error)

			frameworks.splice(frameworks.indexOf(target!), 1)
		} finally {
			await kill()
		}
	}

	const estimateTime = frameworks.length * (commands.length * time + 1)

	console.log()
	console.log(`${frameworks.length} frameworks`)
	for (const framework of frameworks) console.log(`- ${framework}`)

	console.log(`\nEstimate time: ${secToMin(estimateTime)} min`)

	// process.exit()

	result.write(
		`
|  Framework       | Runtime | Average | Ping       | Query      | Body       |
| ---------------- | ------- | ------- | ---------- | ---------- | ---------- |
`
	)

	for (const target of frameworks) {
		const kill = spawn(target!)

		let [runtime, framework, index] = target!.split('/') as [
			keyof typeof runtimeCommand,
			string,
			string
		]

		const name = framework.replace('/index', '')

		const frameworkResultFile = Bun.file(`results/${runtime}/${name}.txt`)
		const frameworkResult = frameworkResultFile.writer()

		result.write(`| ${name} | ${runtime} `)

		// Wait .3 second for server to bootup
		await sleep(0.4)

		let content = ''
		const total = []

		for (const command of commands) {
			frameworkResult.write(`${command}\n`)

			console.log(command)

			const res = await Bun.spawn({
				cmd: command.split(' '),
				env: Bun.env
			})

			const stdout = await new Response(res.stdout).text()
			console.log(stdout)

			const results = catchNumber.exec(stdout)
			if (!results?.[1]) continue

			content += `| ${format(results[1])} `
			total.push(toNumber(results[1]))

			frameworkResult.write(results + '\n')
		}

		content =
			`| ${format(
				total.reduce((a, b) => +a + +b, 0) / commands.length
			)} ` +
			content +
			'|\n'

		result.write(content)
		await result.flush()

		await kill()
	}
}

const toNumber = (a: string) => +a.replaceAll(',', '')

const arrange = () => {
	const table = readFileSync('results/results.md', {
		encoding: 'utf-8'
	})

	const orders = []

	const [title, divider, ...rows] = table.split('\n')
	for (const row of rows) {
		const data = row
			.replace(/\ /g, '')
			.split('|')
			.filter((a) => a)

		if (data.length !== commands.length + 3) continue

		const [name, runtime, total] = data
		orders.push({
			name,
			runtime,
			total: toNumber(total),
			row
		})
	}

	const content = [
		title,
		divider,
		...orders.sort((a, b) => b.total - a.total).map((a) => a.row)
	].join('\n')

	console.log(content)
	writeFileSync('results/results.md', content)

	process.exit(0)
}

process.on('beforeExit', async () => {
	await killPort(3000)
})

main().then(arrange)
