import fun from 'vixeny/fun'

export default {
	fetch: fun({
		hasName: 'http://localhost:3000/'
	})([
		{
			path: '/',
			type: 'response',
			r: () => new Response('Hi')
		},
		{
			path: '/id/:id',
			headings: {
				headers: new Headers([[
					'x-powered-by', 'benchmark'
				]])
			},
			param:{
				unique: true
			},
			query: {
				unique: true,
				name: "name"
			},
            // @ts-ignore
			f: (f) => f.param+ ' ' + f.query
		},
		{
			path: '/json',
			method: 'POST',
			headings: {
				headers: new Headers([[
					'content-type', 'application/json'
				]])
			},
			f: async (f) => JSON.stringify(await f.req.json())
		}
	])
}
