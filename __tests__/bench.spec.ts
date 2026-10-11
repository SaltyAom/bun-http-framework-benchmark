import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'fs'
import {
	buildBenchmarkArgs,
	parseFrameworks,
	parseRps,
	renderReadme,
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

describe('README generation', () => {
	it('renders the real template without losing benchmark or visual instructions', () => {
		const template = readFileSync(
			new URL('../README.template.md', import.meta.url),
			'utf8'
		)
		const results = renderResults([
			{
				name: 'elysia',
				runtime: 'bun',
				throughput: [1000, 900, 800, 700],
				bundleSize: 1024,
				startupMs: 12.3,
				memoryBefore: null,
				memoryAfter: null
			}
		])
		const uname = 'Linux benchmark-host 6.0 x86_64 GNU/Linux'
		const readme = renderReadme(template, { results, uname })

		expect(readme).toContain(`These results are measured in req/s:\n\n${results}`)
		expect(readme).toContain(`$ uname -a\n${uname}\n`)
		expect(readme).toContain('bun benchmark bun/elysia node/effect')
		expect(readme).toContain('To view the results as bouncing balls')
		expect(readme).toContain('The vertical memory chart below the balls')
		expect(readme).toContain('These routes are not requested during the load test')
		expect(readme).toContain('See more detail in [results]')
		expect(readme).not.toContain('{{results}}')
		expect(readme).not.toContain('{{uname}}')
		expect(readme).not.toContain('Intel Core i7-13700K')
		expect(readme).not.toContain('- Bun 1.4.2')
		expect(readme).not.toContain('- Node 26.1.0')
		expect(readme).not.toContain('- Deno 2.9.4')
	})

	it('rejects missing or duplicate placeholders', () => {
		const template = '{{results}}\n{{uname}}'
		for (const token of ['{{results}}', '{{uname}}']) {
			for (const invalid of [template.replace(token, ''), template + token])
				expect(() =>
					renderReadme(invalid, { results: 'table', uname: 'system' })
				).toThrow(`exactly one ${token}`)
		}
	})

	it('preserves dollar sequences and does not replace placeholders inside values', () => {
		const results = "$& $` $' $$ {{uname}}"
		const uname = '{{results}} $&'

		expect(
			renderReadme('before {{results}} between {{uname}} after', {
				results,
				uname
			})
		).toBe(`before ${results} between ${uname} after`)
	})
})
