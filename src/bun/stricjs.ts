import { Router } from '@stricjs/router';
import { query as parse } from '@stricjs/utils';

const jsonHeaders = { headers: { 'Content-Type': 'application/json' } }, 
    stringify = JSON.stringify, 
    benchHeaders = { headers: { 'x-powered-by': 'benchmark' } };

export default new Router()
    .get('/', () => new Response('Hi'))
    .post('/json', async req => new Response(
        stringify(await req.json()), jsonHeaders
    ))
    .get('/id/:id', ({
        params: { id }, query, url
    }) => new Response(
        id + ' ' + parse(
            url.substring(query + 1)
        ).name, benchHeaders
    ))
    .use(404);
