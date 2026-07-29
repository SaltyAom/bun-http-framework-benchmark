const { Hono } = require("hono")
const { serve } = require("@hono/node-server")
const { createReadStream } = require('node:fs')
const { Readable } = require('node:stream')
const { extraRoutes } = require('../extra-routes.mjs')

const app = new Hono()
for (const route of extraRoutes) {
	app.get(route, (c) => c.text('ok'))
		.post(`${route}/submit`, (c) => c.text('ok'))
}

app.get("/", (c) => c.text("Hi"))
	.get('/video', (c) => {
		c.header('content-type', 'video/mp4')
		return c.body(Readable.toWeb(createReadStream('public/kyuukurarin.mp4')))
	})
	.post("/json", (c) => c.req.json().then(c.json))
	.get("/id/:id", (c) => {
		const id = c.req.param("id")
		const name = c.req.query("name") ?? ""

		c.header("x-powered-by", "benchmark")

		return c.text(`${id} ${name}`)
	})

serve(app)
