import { createReadStream } from 'node:fs'
import { Readable } from 'node:stream'
import { server } from '@nifrajs/core/server'
import { serve } from '@nifrajs/node'
import { extraRoutes } from '../extra-routes.mjs'

const app = server()
const ok = (c) => c.text('ok')
for (const route of extraRoutes) app.get(route, ok).post(`${route}/submit`, ok)

app.get('/', (c) => c.text('Hi'))
	.get('/video', () =>
		new Response(Readable.toWeb(createReadStream('public/kyuukurarin.mp4')) as ReadableStream, {
			headers: { 'content-type': 'video/mp4' }
		})
	)
	.get('/id/:id', (c) =>
		c.text(`${c.params.id} ${c.query.get('name') ?? ''}`, {
			headers: { 'x-powered-by': 'benchmark' }
		})
	)
	.post('/json', (c) => c.req.json())

serve(app, { port: 3000 })
