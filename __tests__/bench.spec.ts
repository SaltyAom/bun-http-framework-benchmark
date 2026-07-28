import { describe, expect, it } from 'bun:test'
import {
	buildBenchmarkArgs,
	parseFrameworks,
	parseRps,
	renderResults
} from '../bench'
import {
	extraRoutes,
	matchesExtraPostRoute,
	matchesExtraRoute
} from '../src/extra-routes.mjs'

describe('benchmark options', () => {
	it('parses RPS', () => {
		expect(parseRps('25000')).toBe(25000)
		expect(parseRps('')).toBe(0)
		expect(() => parseRps('-1')).toThrow()
	})

	it('adds a rate limit only when configured', () => {
		expect(buildBenchmarkArgs(['http://localhost'], 1000)).toContain('-r')
		expect(buildBenchmarkArgs(['http://localhost'], 0)).not.toContain('-r')
		expect(buildBenchmarkArgs(['http://localhost'], 0, 10)).toContain('10')
	})

	it('selects framework arguments', () => {
		const available = ['bun/elysia', 'node/effect']

		expect(
			parseFrameworks(['bun/elysia', 'bun/elysia'], available)
		).toEqual(['bun/elysia'])
		expect(() => parseFrameworks(['elysia'], available)).toThrow(
			'Unknown framework'
		)
		expect(() =>
			parseFrameworks(['--interactive', 'bun/elysia'], available)
		).toThrow('cannot be combined')
	})

	it('aligns the Markdown results table', () => {
		const markdown = renderResults([
			{
				name: 'elysia',
				runtime: 'bun',
				throughput: [1000, 900, 800, 700],
				bundleSize: 150 * 1024,
				startupMs: 12.3,
				memoryBefore: 10 * 1024 * 1024,
				memoryAfter: 12 * 1024 * 1024
			}
		])

		expect(markdown).toContain('| elysia    | bun     |     850 |')
		expect(markdown).toContain('| --------- | ------- | ------: |')
		expect(markdown).toContain('150.0 KB')
		expect(markdown).toContain('10.0 / 12.0 MB')
	})

	it('defines unique background routes', () => {
		const routes = extraRoutes.flatMap((route) => [route, `${route}/submit`])

		expect(routes.length).toBeGreaterThanOrEqual(40)
		expect(new Set(routes).size).toBe(routes.length)
		expect(matchesExtraRoute('/users/verify/profile')).toBe(true)
		expect(matchesExtraPostRoute('/v2/en/users/verify/profile/submit')).toBe(true)
	})
})
