import {
	existsSync,
	mkdirSync,
	readdirSync,
	rmSync,
	statSync,
	writeFileSync
} from 'fs'
import killPort from 'kill-port'
import { emitKeypressEvents } from 'node:readline'

const whitelists: string[] = []

const blacklists = [
	'node/hapi',
	'bun/xirelta',
	'bun/bagel',
	'bun/bunrest',
	'bun/colston',
	'deno/byte',
	'bun/fastify'
] as const

const duration = 10
const connections = 500
const baseUrl = 'http://127.0.0.1:3000'
const elysiaAot = ['bun/elysia-aot', 'node/elysia-aot']
const videoSize = statSync('public/kyuukurarin.mp4').size
const videoHeaders = {
	'Cache-Control': 'no-store',
	'If-None-Match': '"benchmark-force-full-response"'
}

const benchmarks = [
	{ name: 'Ping', args: [`${baseUrl}/`] },
	{ name: 'Query', args: [`${baseUrl}/id/1?name=bun`] },
	{
		name: 'Body',
		args: [
			'-m',
			'POST',
			'-H',
			'Content-Type:application/json',
			'-f',
			'./scripts/body.json',
			`${baseUrl}/json`
		]
	},
	{
		name: 'Video',
		connections: 10,
		args: [
			'-H',
			'Cache-Control:no-store',
			'-H',
			'If-None-Match:"benchmark-force-full-response"',
			`${baseUrl}/video`
		]
	}
] as const

const runtimeCommand = {
	node: ['node'],
	deno: ['deno', 'run', '--allow-net', '--allow-env', '--allow-read=public'],
	bun: ['bun']
} as const

type Runtime = keyof typeof runtimeCommand
type BenchmarkResult = {
	name: string
	runtime: Runtime
	throughput: number[]
	bundleSize: number | null
	startupMs: number
	memoryBefore: number | null
	memoryAfter: number | null
}

const sleep = (seconds: number) =>
	new Promise((resolve) => setTimeout(resolve, seconds * 1000))

export const parseRps = (input: string) => {
	const rps = input.trim() === '' ? 0 : Number(input)
	if (!Number.isInteger(rps) || rps < 0)
		throw new Error('RPS must be a non-negative integer')

	return rps
}

export const buildBenchmarkArgs = (
	args: readonly string[],
	rps: number,
	benchmarkConnections = connections
) => [
	'--fasthttp',
	'-c',
	String(benchmarkConnections),
	'-d',
	`${duration}s`,
	...(rps ? ['-r', String(rps)] : []),
	...args
]

export const discoverFrameworks = () =>
	readdirSync('src', { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.flatMap((runtime) =>
			readdirSync(`src/${runtime.name}`, { withFileTypes: true })
				.filter(
					(entry) =>
						entry.isDirectory() ||
						entry.name.endsWith('.ts') ||
						entry.name.endsWith('.js')
				)
				.map((entry) =>
					entry.isDirectory()
						? `${runtime.name}/${entry.name}/index`
						: `${runtime.name}/${entry.name.replace(/\.(j|t)s$/, '')}`
				)
		)
		.concat(...elysiaAot)
		.filter(
			(target) =>
				!blacklists.includes(target as (typeof blacklists)[number])
		)
		.sort()

export const parseFrameworks = (args: string[], available: string[]) => {
	const requested = args.filter((arg) => arg !== '--interactive')
	if (args.includes('--interactive') && requested.length)
		throw new Error('--interactive cannot be combined with framework arguments')

	const unknown = requested.filter((framework) => !available.includes(framework))
	if (unknown.length)
		throw new Error(`Unknown framework: ${unknown.join(', ')}`)

	return [...new Set(requested)]
}

const selectFrameworks = (frameworks: string[]) =>
	new Promise<string[]>((resolve, reject) => {
		if (!process.stdin.isTTY)
			throw new Error('--interactive requires a terminal')

		let cursor = 0
		let rendered = false
		const selected = new Set<number>()
		const wasRaw = Boolean(process.stdin.isRaw)
		const render = () => {
			if (rendered) process.stdout.write(`\x1b[${frameworks.length}A`)
			process.stdout.write(
				frameworks
					.map(
						(framework, index) =>
							`\x1b[2K${index === cursor ? '❯' : ' '} [${selected.has(index) ? 'x' : ' '}] ${framework}\n`
					)
					.join('')
			)
			rendered = true
		}
		const finish = (error?: Error) => {
			process.stdin.setRawMode(wasRaw)
			process.stdin.off('keypress', onKeypress)
			if (error) process.stdin.pause()
			process.stdout.write('\n')
			if (error) reject(error)
			else resolve(frameworks.filter((_, index) => selected.has(index)))
		}
		const onKeypress = (
			input: string,
			key: { name?: string; ctrl?: boolean }
		) => {
			if (key.ctrl && key.name === 'c')
				return finish(new Error('Interactive benchmark cancelled'))
			if (key.name === 'return' || key.name === 'enter') {
				if (selected.size) return finish()
				process.stdout.write('\x07')
				return
			}
			if (key.name === 'space' || input === ' ')
				selected.has(cursor)
					? selected.delete(cursor)
					: selected.add(cursor)
			if (key.name === 'up')
				cursor = (cursor - 1 + frameworks.length) % frameworks.length
			else if (key.name === 'down')
				cursor = (cursor + 1) % frameworks.length
			else if (key.name !== 'space' && input !== ' ') return
			render()
		}

		console.log('\nFrameworks (↑/↓ move, Space toggle, Enter confirm):')
		emitKeypressEvents(process.stdin)
		process.stdin.setRawMode(true)
		process.stdin.resume()
		process.stdin.on('keypress', onKeypress)
		render()
	})

const interactiveOptions = async (frameworks: string[]) => {
	const selected = await selectFrameworks(frameworks)

	while (true) {
		try {
			const rps = parseRps(
				prompt('RPS limit (Enter = unlimited): ') ?? ''
			)
			process.stdin.pause()
			return { frameworks: selected, rps }
		} catch (error) {
			console.error((error as Error).message)
		}
	}
}

export const ensurePortFree = async () => {
	try {
		await fetch(baseUrl)
		await killPort(3000)
		await sleep(0.2)
	} catch {
		// Port is already free.
	}
}

const builtFile = (target: string) =>
	`dist/${target}/index.${target === 'node/effect' ? 'mjs' : 'js'}`

export const startServer = (target: string, quiet = false) => {
	let [runtime, framework, index] = target.split('/') as [
		Runtime,
		string,
		string | undefined
	]
	if (index) framework += '/index'

	const source = existsSync(`src/${runtime}/${framework}.ts`)
		? `src/${runtime}/${framework}.ts`
		: `src/${runtime}/${framework}.js`
	const file =
		runtime === 'deno'
			? source
			: builtFile(target)
	const startedAt = performance.now()
	const server = Bun.spawn({
		cmd: [...runtimeCommand[runtime], file],
		env: {
			...Bun.env,
			NODE_ENV: 'production',
			...(target === 'node/adonis/index'
				? {
						HOST: '127.0.0.1',
						PORT: '3000',
						APP_KEY: 'benchmark-key-0123456789abcdef',
						APP_NAME: 'benchmark',
						DRIVE_DISK: 'local'
					}
				: {})
		},
		stdout: quiet ? 'ignore' : 'inherit',
		stderr: 'inherit'
	})

	return {
		pid: server.pid,
		startedAt,
		stop: async () => {
			if (server.exitCode === null) server.kill()
			await server.exited

			try {
				await fetch(baseUrl)
				await killPort(3000)
			} catch {
				// The server released the port itself.
			}
		}
	}
}

export const buildFramework = async (target: string) => {
	if (target.startsWith('deno/')) return null

	const build = Bun.spawn({
		cmd: ['bun', 'scripts/build-framework.ts', target],
		stdout: 'inherit',
		stderr: 'inherit'
	})
	if ((await build.exited) !== 0) throw new Error(`${target} build failed`)

	return statSync(builtFile(target)).size
}

export const waitForStartup = async (startedAt: number) => {
	let lastError: unknown
	while (performance.now() - startedAt < 10_000) {
		try {
			const response = await fetch(`${baseUrl}/`)
			return { response, startupMs: performance.now() - startedAt }
		} catch (error) {
			lastError = error
			await sleep(0.05)
		}
	}

	throw new Error(`Server did not start within 10s: ${lastError}`)
}

export const validateServer = async (index: Response) => {
	if ((await index.text()) !== 'Hi')
		throw new Error('Index: Result not match')
	if (!index.headers.get('Content-Type')?.includes('text/plain'))
		throw new Error('Index: Content-Type not match')

	const query = await fetch(`${baseUrl}/id/1?name=bun`)
	if ((await query.text()) !== '1 bun')
		throw new Error('Query: Result not match')

	if (!query.headers.get('Content-Type')?.includes('text/plain'))
		throw new Error('Query: Content-Type not match')

	if (!query.headers.get('X-Powered-By')?.includes('benchmark'))
		throw new Error('Query: X-Powered-By not match')

	const multiQuery = await fetch(`${baseUrl}/id/1?name=alice&id=1`)
	if ((await multiQuery.text()) !== '1 alice')
		throw new Error('Query: Multi-param result not match')

	const missingQuery = await fetch(`${baseUrl}/id/1?id=1`)
	if ((await missingQuery.text()) !== '1 ')
		throw new Error('Query: Missing-param result not match')

	const body = await fetch(`${baseUrl}/json`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: '{ "hello" : "world" }'
	})

	if ((await body.text()) !== JSON.stringify({ hello: 'world' }))
		throw new Error('Body: Result not match')

	if (!body.headers.get('Content-Type')?.includes('application/json'))
		throw new Error('Body: Content-Type not match')

	const video = await fetch(`${baseUrl}/video`, { headers: videoHeaders })
	if (video.status !== 200) throw new Error(`Video: Expected 200, got ${video.status}`)

	if (!video.headers.get('Content-Type')?.includes('video/mp4'))
		throw new Error('Video: Content-Type not match')

	if ((await video.arrayBuffer()).byteLength !== videoSize)
		throw new Error('Video: Content length not match')
}

const memoryUsage = async (pid: number) => {
	const process = Bun.spawn({
		cmd: ['ps', '-o', 'rss=', '-p', String(pid)],
		stdout: 'pipe',
		stderr: 'ignore'
	})
	const output = await new Response(process.stdout).text()
	await process.exited
	const rss = output.trim()
	const rssKb = rss ? Number(rss) : Number.NaN

	return Number.isFinite(rssKb) ? rssKb * 1024 : null
}

const runBombardier = async (args: string[]) => {
	const command = ['bombardier', ...args]
	console.log(command.join(' '))

	const process = Bun.spawn({
		cmd: command,
		env: Bun.env,
		stdout: 'pipe',
		stderr: 'pipe'
	})
	const [stdout, stderr, exitCode] = await Promise.all([
		new Response(process.stdout).text(),
		new Response(process.stderr).text(),
		process.exited
	])
	if (exitCode !== 0)
		throw new Error(stderr.trim() || `bombardier exited with ${exitCode}`)

	console.log(stdout)
	const requestsPerSecond = /Reqs\/sec\s+([\d,.]+)/m.exec(stdout)?.[1]
	if (!requestsPerSecond)
		throw new Error('Could not read Reqs/sec from bombardier output')

	return {
		command: command.join(' '),
		output: stdout,
		requestsPerSecond: Number(requestsPerSecond.replaceAll(',', ''))
	}
}

const runFramework = async (
	target: string,
	rps: number
): Promise<BenchmarkResult | null> => {
	const [runtime, framework] = target.split('/') as [Runtime, string]

	console.log(`\n${framework} (${runtime})`)
	try {
		const bundleSize = await buildFramework(target)
		const server = startServer(target)
		try {
			const { response, startupMs } = await waitForStartup(
				server.startedAt
			)
			await validateServer(response)
			const memoryBefore = await memoryUsage(server.pid)
			const throughput: number[] = []
			const raw: string[] = [
				`Bundle: ${formatBytes(bundleSize)}`,
				`Startup: ${startupMs.toFixed(1)} ms`,
				`Memory before: ${formatMemory(memoryBefore)}`
			]

			for (const benchmark of benchmarks) {
				const result = await runBombardier(
					buildBenchmarkArgs(
						benchmark.args,
						rps,
						'connections' in benchmark
							? benchmark.connections
							: undefined
					)
				)
				throughput.push(result.requestsPerSecond)
				raw.push(`\n${result.command}\n${result.output.trim()}`)
			}

			const memoryAfter = await memoryUsage(server.pid)
			raw.push(`\nMemory after: ${formatMemory(memoryAfter)}`)
			writeFileSync(`results/${runtime}/${framework}.txt`, raw.join('\n'))

			return {
				name: framework,
				runtime,
				throughput,
				bundleSize,
				startupMs,
				memoryBefore,
				memoryAfter
			}
		} finally {
			await server.stop()
		}
	} catch (error) {
		console.error(`❌ ${target}: ${(error as Error)?.message || error}`)
		return null
	}
}

const number = new Intl.NumberFormat('en-US', { maximumFractionDigits: 3 })
const formatNumber = (value: number) => number.format(value)
const formatBytes = (bytes: number | null) =>
	bytes === null
		? 'n/a'
		: `${(bytes / (bytes < 1024 * 1024 ? 1024 : 1024 * 1024)).toFixed(1)} ${bytes < 1024 * 1024 ? 'KB' : 'MB'}`
const formatMemory = (bytes: number | null) =>
	bytes === null ? 'n/a' : `${(bytes / 1024 / 1024).toFixed(1)} MB`
const formatMemoryPair = (before: number | null, after: number | null) =>
	before === null || after === null
		? 'n/a'
		: `${(before / 1024 / 1024).toFixed(1)} / ${(after / 1024 / 1024).toFixed(1)} MB`

export const renderResults = (results: BenchmarkResult[]) => {
	const headers = [
		'Framework',
		'Runtime',
		'Average',
		'Ping',
		'Query',
		'Body',
		'Video',
		'Bundle Size',
		'Startup',
		'Memory Before/After'
	]
	const rows = results
		.map((result) => ({
			...result,
			average:
				result.throughput.reduce((total, value) => total + value, 0) /
				result.throughput.length
		}))
		.sort((a, b) => b.average - a.average)
		.map((result) => [
			result.name,
			result.runtime,
			formatNumber(result.average),
			...result.throughput.map(formatNumber),
			formatBytes(result.bundleSize),
			`${result.startupMs.toFixed(1)} ms`,
			formatMemoryPair(result.memoryBefore, result.memoryAfter)
		])
	const widths = headers.map((header, index) =>
		Math.max(header.length, ...rows.map((row) => row[index]!.length))
	)
	const row = (cells: string[], header = false) =>
		`| ${cells
			.map((cell, index) =>
				header || index < 2
					? cell.padEnd(widths[index]!)
					: cell.padStart(widths[index]!)
			)
			.join(' | ')} |`
	const divider = widths.map((width, index) =>
		index < 2 ? '-'.repeat(width) : `${'-'.repeat(width - 1)}:`
	)

	return [
		row(headers, true),
		row(divider, true),
		...rows.map((cells) => row(cells))
	].join('\n')
}

const main = async () => {
	const discovered = discoverFrameworks()
	const args = Bun.argv.slice(2)
	const requested = parseFrameworks(args, discovered)
	const options = args.includes('--interactive')
		? await interactiveOptions(discovered)
		: {
				frameworks: requested.length
					? requested
					: whitelists.length
					? whitelists.filter((framework) =>
							discovered.includes(framework)
						)
					: discovered,
				rps: 0
			}
	await ensurePortFree()

	console.log(`\n${options.frameworks.length} frameworks`)
	options.frameworks.forEach((framework) => console.log(`- ${framework}`))
	console.log(
		`RPS: ${options.rps || 'unlimited'}\nEstimated time: ${Math.ceil((options.frameworks.length * benchmarks.length * duration) / 60)} min`
	)

	rmSync('results', { recursive: true, force: true })
	mkdirSync('results')
	for (const runtime of new Set(
		options.frameworks.map((item) => item.split('/')[0])
	))
		mkdirSync(`results/${runtime}`)

	const results: BenchmarkResult[] = []
	for (const framework of options.frameworks) {
		const result = await runFramework(framework, options.rps)
		if (result) results.push(result)
	}

	const markdown = renderResults(results)
	writeFileSync('results/results.md', markdown)
	console.log(`\n${markdown}`)
}

if (import.meta.main)
	main().catch((error) => {
		if ((error as Error).message === 'Interactive benchmark cancelled') {
			process.exitCode = 130
			return
		}
		console.error(error)
		process.exitCode = 1
	})
