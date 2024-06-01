import { Byte, query, send } from '@bit-js/byte'

const xPoweredBy = ['X-Powered-By', 'benchmark'] as [string, string]

// Extract the 'name' parameter value from query
const getName = query.get('name')

// Serve directly
export default new Byte()
	.get('/', send.body('Hi'))
	// Send ID with query
	.get('/id/:id', (ctx) => {
		ctx.headers.push(xPoweredBy)
		return ctx.body(`${ctx.params.id} ${getName(ctx)}`)
	})
	// Yield body
	.post('/json', async (ctx) => ctx.json(await ctx.req.json()))
