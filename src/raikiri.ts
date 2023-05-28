import { Raikiri } from "raikiri"

export const mapPathnameAndQueryRegEx = /:\/\/[^/]+([^#?]+)(?:\?([^#]+))?/

const app = new Raikiri<
	(
		request: Request,
		params: Record<string, string>,
		query?: URLSearchParams
	) => Response | Promise<Response>
>()

app.add("GET", "/", () => new Response("Hi"))
app.add("POST", "/json", (req) =>
	req.json().then(
		(x) =>
			new Response(JSON.stringify(x), {
				headers: {
					"content-type": "application/json"
				}
			})
	)
)

app.add("GET", "/id/:id", (req, params, query) => {
	return new Response(`${params.id} ${query?.get("name")}`, {
		headers: {
			"x-powered-by": "benchmark"
		}
	})
})

Bun.serve({
	port: 3000,
	fetch(request) {
		const sliced = request.url.match(mapPathnameAndQueryRegEx)

		if (!sliced)
			return new Response("NOT_FOUND", {
				status: 404
			})

		const matched = app.match(request.method, sliced[1])

		if (!matched?.store)
			return new Response("NOT_FOUND", {
				status: 404
			})

		return matched.store(
			request,
			matched.params,
			sliced[2] ? new URLSearchParams(sliced[2]) : undefined
		)
	}
})
