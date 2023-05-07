import { serve } from "https://deno.land/std@v0.186.0/http/server.ts"

import cheetah from "https://deno.land/x/cheetah@v0.5.0/mod.ts"
import zod, { z } from "https://deno.land/x/cheetah@v0.5.0/validator/zod.ts"

const app = new cheetah({
	validator: zod
})
	.get("/", () => "Hi")
	.get(
		"/id/:id",
		{
			query: z.object({
				name: z.string()
			})
		},
		(ctx) => {
			ctx.res.header("x-powered-by", "benchmark")

			return `${ctx.req.param("id")} ${ctx.req.query.name}`
		}
	)
	.post(
		"/json",
		{
			body: z.object({
				hello: z.string()
			})
		},
		(ctx) => ctx.res.json(ctx.req.body)
	)

serve(app.fetch, {
	port: 3000
})
