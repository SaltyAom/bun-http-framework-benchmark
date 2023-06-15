import { Router } from '@stricjs/router';
import { Query } from '@stricjs/utils';

const opts = {
    headers: { 'content-type': 'application/json' }
};
const p = Query.parse;

export default new Router()
    .get('/', () => new Response('Hi'))
    .post('/json', async req => new Response(
        JSON.stringify(await req.json()), opts
    ))
    .get('/id/:id', ({
        params: { id }, query, url
    }) => new Response(
        id + ' ' + p<{ name: string }>(
            url.substring(query + 1)
        ).name
    ))
    .use(404);
