import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { ballPosition, frameworkLogo, memoryScale, parseResults, playbackElapsed, sortMemory, visualOptions } from '../visual/visualization.mjs'

const table = (row = '| bun | hono | 1,234.567 | 2,000.5 | 0 | 400 | 5 |') => `
| Runtime | Framework | Average | Ping | Query | Body | Video |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
${row}
`

const memoryTable = (pair) => table().replace('Video |', 'Video | Memory Before/After |')
	.replace('| --- | --- | ---: | ---: | ---: | ---: | ---: |', '| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |')
	.replace('| bun | hono | 1,234.567 | 2,000.5 | 0 | 400 | 5 |', `| bun | hono | 1,234.567 | 2,000.5 | 0 | 400 | 5 | ${pair} |`)

describe('result data', () => {
	test('uses header names, preserves exact decimals, and accepts zero', () => {
		const [row] = parseResults(table())
		expect(row.runtime).toBe('bun')
		expect(row.framework).toBe('hono')
		expect(row.throughput).toEqual({ Average: 1234.567, Ping: 2000.5, Query: 0, Body: 400, Video: 5 })
		expect(row.display.Average).toBe('1,234.567')
	})

	test('keeps the same framework on different runtimes', () => {
		const rows = parseResults(table('| bun | hono | 10 | 20 | 30 | 40 | 50 |\n| node | hono | 5 | 10 | 15 | 20 | 25 |'))
		expect(rows.map((row) => `${row.runtime}/${row.framework}`)).toEqual(['bun/hono', 'node/hono'])
	})

	test.each(['-1', 'NaN', 'Infinity', '12foo', '1,23', '1.2.3', '', '1e3', '9'.repeat(400)])('rejects invalid throughput %s', (value) => {
		expect(() => parseResults(table().replace('2,000.5', value))).toThrow('Invalid Ping throughput')
	})

	test('rejects missing columns, bad separators, row widths, empty data, and duplicate identities', () => {
		for (const markdown of [table().replace('Average', 'Other'), table().replace('Average', 'Ping'), table().replace('---:', 'broken'), table('| bun | hono | 1 |'), table(''), table() + '| bun | hono | 1 | 2 | 3 | 4 | 5 |'])
			expect(() => parseResults(markdown)).toThrow()
	})

	test('parses the actual results file', () => {
		const rows = parseResults(readFileSync(new URL('../results/results.md', import.meta.url), 'utf8'))
		expect(rows.length).toBeGreaterThan(0)
	})
})

describe('memory comparison', () => {
	const sortRows = [
		{ framework: 'zebra', runtime: 'node', memory: null },
		{ framework: 'hono', runtime: 'node', memory: { before: 20, after: 10 } },
		{ framework: 'alpha', runtime: 'bun', memory: { before: 10, after: 20 } },
		{ framework: 'hono', runtime: 'bun', memory: { before: 20, after: 10 } },
		{ framework: 'zero', runtime: 'bun', memory: { before: 0, after: 0 } },
		{ framework: 'absent', runtime: 'deno', memory: null }
	]
	const sortIds = (rows) => rows.map((row) => `${row.runtime}/${row.framework}`)

	test('sorts Before and After ascending with zero first, unavailable last, and deterministic ties', () => {
		expect(sortIds(sortMemory(sortRows, 'before'))).toEqual(['bun/zero', 'bun/alpha', 'bun/hono', 'node/hono', 'deno/absent', 'node/zebra'])
		expect(sortIds(sortMemory(sortRows, 'after'))).toEqual(['bun/zero', 'bun/hono', 'node/hono', 'bun/alpha', 'deno/absent', 'node/zebra'])
		expect(sortMemory(sortRows)).toEqual(sortMemory(sortRows, 'after'))
	})

	test('sorts Name by framework then runtime without mutating the selected rows', () => {
		const selected = sortRows.slice()
		expect(sortIds(sortMemory(selected, 'name'))).toEqual(['deno/absent', 'bun/alpha', 'bun/hono', 'node/hono', 'node/zebra', 'bun/zero'])
		for (const sort of ['before', 'after', 'name']) {
			expect(sortMemory(selected, sort)).not.toBe(selected)
			expect(selected).toEqual(sortRows)
		}
		expect(sortMemory([], 'after')).toEqual([])
	})

	test('parses both measurements and preserves source decimal labels', () => {
		expect(parseResults(memoryTable('38.6 / 55.0 MB'))[0].memory).toEqual({
			before: 38.6, after: 55, displayBefore: '38.6', displayAfter: '55.0'
		})
	})

	test('missing columns and n/a are unavailable while zero remains a measurement', () => {
		expect(parseResults(table())[0].memory).toBeNull()
		expect(parseResults(memoryTable('n/a'))[0].memory).toBeNull()
		expect(parseResults(memoryTable('0.0 / 0.0 MB'))[0].memory).toEqual({
			before: 0, after: 0, displayBefore: '0.0', displayAfter: '0.0'
		})
	})

	test.each(['', '-1 / 2 MB', '1 / -2 MB', 'NaN / 2 MB', '1 / Infinity MB', '1 / 2', '1 / 2 KB', '1 MB', '1 / 2 MB extra', '1e2 / 2 MB', `${'9'.repeat(400)} / 2 MB`])('rejects malformed memory %s', (pair) => {
		expect(() => parseResults(memoryTable(pair))).toThrow('Invalid memory before/after for bun/hono')
	})

	test('sets the zero baseline scale from every before and after measurement', () => {
		const rows = [parseResults(memoryTable('255.1 / 47.7 MB'))[0], parseResults(memoryTable('41.5 / 255.1 MB'))[0]]
		expect(memoryScale(rows)).toEqual({ maximum: 300, step: 50 })
		const scale = memoryScale(rows)
		const selected = rows.slice(1)
		expect(selected[0].memory.before / scale.maximum).toBeCloseTo(41.5 / 300)
		expect(selected[0].memory.after / scale.maximum).toBeCloseTo(255.1 / 300)
		expect(memoryScale([parseResults(memoryTable('0 / 0 MB'))[0]])).toEqual({ maximum: 50, step: 10 })
		expect(memoryScale([parseResults(memoryTable('n/a'))[0]])).toEqual({ maximum: 50, step: 10 })
	})

	test('fits every published RSS sample within the shared scale', () => {
		const rows = parseResults(readFileSync(new URL('../results/results.md', import.meta.url), 'utf8'))
		const { maximum, step } = memoryScale(rows)
		expect(step).toBeGreaterThan(0)
		for (const row of rows.filter((row) => row.memory)) {
			expect(row.memory.before).toBeLessThanOrEqual(maximum)
			expect(row.memory.after).toBeLessThanOrEqual(maximum)
		}
	})
})

describe('ball motion', () => {
	test.each([4, 32, 64])('%s× speed changes affect future elapsed time and preserve the current position', (speed) => {
		const before = playbackElapsed(0, 100, 1600, 1)
		const afterChange = playbackElapsed(before, 1600, 1600, speed)
		expect(ballPosition(afterChange, 100, 100, 400)).toBe(ballPosition(before, 100, 100, 400))
		const later = playbackElapsed(before, 1600, 1600 + 1000 / speed, speed)
		expect(later).toBe(2500)
		expect(ballPosition(later, 100, 100, 400)).toBeCloseTo(ballPosition(later, 50, 100, 400) * 2)
		expect(playbackElapsed(later, null, 9000, 0.25)).toBe(later)
		expect(playbackElapsed(later, 9000, 11000, 0.25)).toBe(3000)
	})

	test('starts at the left, reflects at both ends, and repeats', () => {
		expect([0, 3000, 6000, 9000, 12000, 15000].map((time) => ballPosition(time, 100, 100, 400))).toEqual([0, 200, 400, 200, 0, 200])
		expect(ballPosition(5999, 100, 100, 400)).toBeCloseTo(ballPosition(6001, 100, 100, 400))
		expect(ballPosition(11999, 100, 100, 400)).toBeCloseTo(ballPosition(12001, 100, 100, 400))
	})

	test('speed ratios are linear and stay fixed when runtimes are filtered', () => {
		const rows = parseResults(table('| bun | hono | 10 | 200 | 0 | 0 | 0 |\n| node | hono | 10 | 100 | 0 | 0 | 0 |'))
		const maximum = Math.max(...rows.map((row) => row.throughput.Ping))
		const fast = ballPosition(1500, rows[0].throughput.Ping, maximum, 400)
		const slow = ballPosition(1500, rows.filter((row) => row.runtime === 'node')[0].throughput.Ping, maximum, 400)
		expect(fast).toBe(100)
		expect(slow).toBe(50)
	})

	test('zero throughput and zero travel stay at the left', () => {
		expect(ballPosition(9000, 0, 100, 400)).toBe(0)
		expect(ballPosition(9000, 0, 0, 400)).toBe(0)
		expect(ballPosition(9000, 100, 100, 0)).toBe(0)
	})
})

describe('visual options', () => {
	const rows = ['node/uws', 'node/hyper-express', 'node/ultimate-express', 'node/hono', 'node/express', 'bun/hono', 'bun/express', 'deno/hono']
		.map((id) => { const [runtime, framework] = id.split('/'); return { runtime, framework } })
	const ids = (options) => options.included.map((row) => `${row.runtime}/${row.framework}`)

	test('defaults legacy options to After and restores valid memory sorts', () => {
		for (const saved of [null, {}, { metric: 'Video' }, { memorySort: 'Before' }, { memorySort: 'other' }, { memorySort: null }, { memorySort: 0 }])
			expect(visualOptions(rows, saved).memorySort).toBe('after')
		for (const memorySort of ['before', 'after', 'name'])
			expect(visualOptions(rows, JSON.stringify({ memorySort })).memorySort).toBe(memorySort)
	})

	test('defaults legacy or invalid memory views to Both and restores each valid view', () => {
		for (const saved of [null, {}, { memorySort: 'before' }, { memoryView: 'Before' }, { memoryView: 'neither' }, { memoryView: null }, { memoryView: false }, { memoryView: [] }, '{broken'])
			expect(visualOptions(rows, saved).memoryView).toBe('both')
		for (const memoryView of ['both', 'before', 'after']) {
			const options = visualOptions(rows, JSON.stringify({ memoryView, memorySort: 'name', selection: ['node/hono', 'bun/express'] }))
			expect(options).toMatchObject({ memoryView, memorySort: 'name', preset: 'custom' })
			expect(ids(options)).toEqual(['node/hono', 'bun/express'])
		}
	})

	test('Node HTTP excludes only the specified Node frameworks and Node still includes all Node targets', () => {
		expect(ids(visualOptions(rows, { selection: 'node-http' }))).toEqual(['node/hono', 'node/express'])
		expect(ids(visualOptions(rows, { selection: 'node' }))).toEqual(['node/uws', 'node/hyper-express', 'node/ultimate-express', 'node/hono', 'node/express'])
	})

	test('restores custom runtime-qualified IDs without selecting duplicate framework names', () => {
		const options = visualOptions(rows, JSON.stringify({ selection: ['node/hono', 'bun/express', 'removed/framework'] }))
		expect(options.preset).toBe('custom')
		expect(ids(options)).toEqual(['node/hono', 'bun/express'])
	})

	test('keeps intentional empty and entirely stale custom selections empty', () => {
		for (const selection of [[], ['node/removed']]) {
			const options = visualOptions(rows, JSON.stringify({ selection }))
			expect(options.preset).toBe('custom')
			expect(options.included).toEqual([])
		}
	})

	test('restores named presets from the current rows so new targets join them', () => {
		const current = [...rows, { runtime: 'node', framework: 'new-framework' }]
		const options = visualOptions(current, JSON.stringify({ metric: 'Video', speed: 64, paused: true, selection: 'node-http' }))
		expect(options).toMatchObject({ metric: 'Video', speed: 64, paused: true, preset: 'node-http' })
		expect(ids(options)).toEqual(['node/hono', 'node/express', 'node/new-framework'])
		expect(ids(visualOptions(current, { selection: 'bun' }))).toEqual(['bun/hono', 'bun/express'])
	})

	test('uses safe defaults for malformed JSON, invalid top-level data, and invalid fields', () => {
		for (const saved of ['{broken', 'null', 'false', '42', '"node"', '[]', JSON.stringify({ metric: 'Other', speed: '64', paused: 'true', selection: 'missing' }), { selection: [false] }]) {
			const options = visualOptions(rows, saved)
			expect(options).toMatchObject({ metric: 'Ping', speed: 1, paused: false, preset: 'all' })
			expect(options.included).toEqual(rows)
		}
		for (const speed of [0, -1, 0.1, 1.1, 64.25, NaN, Infinity, null, '1'])
			expect(visualOptions(rows, { speed }).speed).toBe(1)
		for (const speed of [0.25, 1, 3.75, 64])
			expect(visualOptions(rows, { speed }).speed).toBe(speed)
	})

	test('restores pause state and forces paused when reduced motion is requested', () => {
		expect(visualOptions(rows, { paused: false }).paused).toBe(false)
		expect(visualOptions(rows, { paused: true }).paused).toBe(true)
		expect(visualOptions(rows, { paused: false }, true).paused).toBe(true)
		expect(visualOptions(rows, null, true).paused).toBe(true)
	})
})


describe('framework logos', () => {
	test('aliases share the canonical local logo', () => {
		for (const [alias, canonical] of [['elysia-aot', 'elysia'], ['bun-web-standard', 'bun'], ['deno-web-standard', 'deno']])
			expect(frameworkLogo(alias)).toEqual(frameworkLogo(canonical))
	})

	test('fallbacks always contain exactly two uppercase alphabet letters', () => {
		for (const [framework, initials] of [['uws', 'UW'], ['ultimate-express', 'UE'], ['hyper-express', 'HE'], ['acorn', 'AC'], ['h3', 'HX'], ['123-future!', 'FU'], ['9z', 'ZX'], ['123', 'XX'], ['constructor', 'CO'], ['__proto__', 'PR']])
			expect(frameworkLogo(framework).initials).toBe(initials)
		for (const framework of ['ultimate-express', 'hyper-express', 'future'])
			expect(frameworkLogo(framework).file).toBeNull()
	})

	test('every mapped result logo is a local PNG asset', () => {
		const rows = parseResults(readFileSync(new URL('../results/results.md', import.meta.url), 'utf8'))
		for (const row of rows) {
			const { file, initials } = frameworkLogo(row.framework)
			expect(initials).toMatch(/^[A-Z]{2}$/)
			if (!file) continue
			expect(file).toMatch(/^[a-z0-9]+\.png$/)
			const image = readFileSync(new URL(`../visual/logos/${file}`, import.meta.url))
			expect(image.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
		}
	})

	test('runtime badges use local Bun, Deno, and Node marks and unknown runtimes use initials', () => {
		for (const runtime of ['bun', 'deno', 'node']) {
			const { file } = frameworkLogo(runtime)
			expect(file).toBe(`${runtime}.png`)
			const image = readFileSync(new URL(`../visual/logos/${file}`, import.meta.url))
			expect(image.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
			expect([image.readUInt32BE(16), image.readUInt32BE(20)]).toEqual([256, 256])
		}
		expect(frameworkLogo('future-runtime')).toEqual({ file: null, initials: 'FU' })
	})
})
