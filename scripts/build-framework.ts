import { existsSync } from 'fs'
import { aot } from 'elysia/plugin/aot/bun'

const target = Bun.argv[2]
if (!target) throw new Error('Usage: bun scripts/build-framework.ts <runtime/framework>')

if (
	target === 'node/adonis/index' &&
	!existsSync('src/node/adonis/node_modules/@adonisjs/core')
) {
	const install = Bun.spawn({
		cmd: ['bun', 'install', '--cwd', 'src/node/adonis', '--frozen-lockfile'],
		stdout: 'inherit',
		stderr: 'inherit'
	})
	if ((await install.exited) !== 0)
		throw new Error('Adonis dependencies failed to install')
}

let [runtime, framework, index] = target.split('/')
if (runtime !== 'bun' && runtime !== 'node')
	throw new Error(`Bun.build does not support the ${runtime} runtime`)
const isEffectV4 = target === 'node/effect'
const isElysiaAot = framework === 'elysia-aot'
if (isElysiaAot) framework = 'elysia'
else if (index) framework += '/index'

const entry = existsSync(`src/${runtime}/${framework}.ts`)
	? `src/${runtime}/${framework}.ts`
	: `src/${runtime}/${framework}.js`
const result = await Bun.build({
	entrypoints: [entry],
	outdir: `dist/${target}`,
	naming: isEffectV4 ? 'index.mjs' : 'index.js',
	target: runtime,
	format: runtime === 'node' && !isEffectV4 ? 'cjs' : 'esm',
	minify: true,
	external: [
		'@nestjs/microservices',
		'@nestjs/microservices/*',
		'@nestjs/websockets/*',
		'class-transformer',
		'class-validator',
		'phc-argon2',
		'phc-bcrypt',
		'uWebSockets.js'
	],
	plugins: isElysiaAot
		? [aot(entry, { target: runtime as 'bun' | 'node' })]
		: []
})

if (!result.success) {
	result.logs.forEach((log) => console.error(log))
	process.exit(1)
}
