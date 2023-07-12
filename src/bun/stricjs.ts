import { Router } from '@stricjs/router';
import { query as parse } from '@stricjs/utils';

const toRes = Response.json, poweredByBench = { headers: { 'x-powered-by': 'benchmark' } };

export default new Router({ host: 'https://localhost:3000' })
    .get('/', () => new Response('Hi'))
    .post('/json', req => req.json().then(toRes))
    .get('/id/:id', ({
        params: { id }, query, url
    }) => new Response(
        id + ' ' + parse(
            url.substring(query + 1)
        ).name, poweredByBench
    ))
    .use(404);
