import { Byte, query, send } from '@bit-js/byte';

// Cache options
const options = { headers: { 'X-Powered-By': 'benchmark' } };

// Extract the 'name' parameter value from query
const getName = query.get('name');

// Serve directly
const app = new Byte()
    .get('/', () => send.body('hi'))
    // Send ID with query
    .get('/id/:id', (ctx) => send.body(`${ctx.params.id} ${getName(ctx)}`, options))
    // Yield body
    .post('/json', (ctx) => ctx.req.json().then(send.json));

Deno.serve({ port: 3000 }, app.fetch);
