import { wrap } from 'vixeny'

Bun.serve({
	fetch: wrap()()
		.petitionWithoutCTX({
			path: '/',
			r: () => new Response('Hi')
		})
		.stdPetition({
			path: '/id/:id',
			headings: {
				// This doesn't work for some reason
				headers: {
					'x-powered-by': 'benchmark'
				}
			},
			param:{
				unique: true
			},
			query: {
				unique: true,
				name: "name"
			},
			f: (f) => f.param + ' ' + f.query
		})
		.stdPetition({
			path: '/json',
			method: 'POST',
			headings: {
				headers: {
					'content-type': 'application/json'
				}
			},
			f: async (f) => JSON.stringify(await f.req.json())
		})
		.compose()
})
