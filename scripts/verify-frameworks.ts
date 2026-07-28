import {
	buildFramework,
	discoverFrameworks,
	ensurePortFree,
	startServer,
	validateServer,
	waitForStartup
} from '../bench'
import { extraRoutes } from '../src/extra-routes.mjs'

const verifyExtraRoutes = async () => {
	for (const route of extraRoutes) {
		const path = route.replace(/:[^/]+/g, 'verify')
		const get = await fetch(`http://127.0.0.1:3000${path}`)
		if (!get.ok || (await get.text()) !== 'ok')
			throw new Error(`GET ${path} failed`)

		const post = await fetch(`http://127.0.0.1:3000${path}/submit`, {
			method: 'POST'
		})
		if (!post.ok || (await post.text()) !== 'ok')
			throw new Error(`POST ${path}/submit failed`)
	}
}

await ensurePortFree()

const frameworks = discoverFrameworks()
const failures: string[] = []
let stopCurrent: (() => Promise<void>) | undefined

process.on('SIGINT', async () => {
	await stopCurrent?.()
	process.exit(130)
})

for (const target of frameworks) {
	process.stdout.write(`${target} ... `)
	try {
		await buildFramework(target)
		const server = startServer(target, true)
		stopCurrent = server.stop
		const { response } = await waitForStartup(server.startedAt)
		await validateServer(response)
		await verifyExtraRoutes()
		console.log('ok')
	} catch (error) {
		const message = (error as Error)?.message || String(error)
		failures.push(`${target}: ${message}`)
		console.log(`failed (${message})`)
	} finally {
		await stopCurrent?.()
		stopCurrent = undefined
	}
}

if (failures.length) {
	console.error(`\n${failures.length}/${frameworks.length} frameworks failed:`)
	failures.forEach((failure) => console.error(`- ${failure}`))
	process.exitCode = 1
} else {
	console.log(`\nAll ${frameworks.length} frameworks passed`)
}
