import { Byte, query, send } from '@bit-js/byte';

// Cache options
const options = { headers: { 'X-Powered-By': 'benchmark' } };

// Extract the 'name' parameter value from query
const getName = query.get('name');

// Serve directly
export default new Byte()
    .get('/', (ctx) => ctx.text('Hi'))
    // Send ID with query
    .get('/id/:id', (ctx) => new Response(`${ctx.params.id} ${getName(ctx)}`, options))
    // Yield body
    .post('/json', async (ctx) => ctx.json(await ctx.req.json()));
