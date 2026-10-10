import { existsSync } from 'fs'
import { aot } from 'elysia/plugin/aot/bun'
import { esmTargets } from '../bench'

const target = Bun.argv[2]
if (!target) throw new Error('Usage: bun scripts/build-framework.ts <runtime/framework>')

let [runtime, framework, index] = target.split('/')
if (runtime !== 'bun' && runtime !== 'node')
	throw new Error(`Bun.build does not support the ${runtime} runtime`)
const isEsm = esmTargets.includes(target)
const isElysiaAot = framework === 'elysia-aot'
if (isElysiaAot) framework = 'elysia'
else if (index) framework += '/index'

const entry = existsSync(`src/${runtime}/${framework}.ts`)
	? `src/${runtime}/${framework}.ts`
	: `src/${runtime}/${framework}.js`
const result = await Bun.build({
	entrypoints: [entry],
	outdir: `dist/${target}`,
	naming: isEsm ? 'index.mjs' : 'index.js',
	target: runtime,
	format: runtime === 'node' && !isEsm ? 'cjs' : 'esm',
	minify: true,
	external: [
		'@nestjs/microservices',
		'@nestjs/microservices/*',
		'@nestjs/websockets/*',
		'class-transformer',
		'class-validator',
		'phc-argon2',
		'phc-bcrypt',
		'pino-pretty',
		'uWebSockets.js',
		'youch'
	],
	plugins: isElysiaAot
		? [aot(entry, { target: runtime as 'bun' | 'node' })]
		: []
})

if (!result.success) {
	result.logs.forEach((log) => console.error(log))
	process.exit(1)
}
