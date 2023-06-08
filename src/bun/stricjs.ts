import { Router } from '..';

// Prepare headers
const jsonHeaders = {
    headers: { 'content-type': 'application/json' }
};
const queryHeaders = {
    headers: { 'x-powered-by': 'benchmark' }
};

// Create a router and serve using Bun
export default new Router()
    // Handle GET request to `/`
    .get('/', () => new Response('Hi'))
    // Handle POST request to `/json`
    .post('/json', async req =>
        new Response(
            JSON.stringify(await req.json()),
            jsonHeaders,
        ))
    // Return 90 for requests to `/id/90` for instance
    .get('/id/:id', ({ params: { id }, url, query }) => {
        if (query === -1)
            return new Response(id);

        return new Response(
            id + ' ' + new URLSearchParams(
                // Slice the query
                url.substring(query + 1)
            ).get('name'), queryHeaders
        )
    })
    // Use the default 404 handler
    .use(404);
