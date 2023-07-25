import { Router } from '@stricjs/router';
import { qs } from '@stricjs/utils';

const toRes = Response.json, parse = qs.searchKey('name'), poweredByBench = { headers: { 'x-powered-by': 'benchmark' } };;

export default new Router({ 
    base: 'http://localhost:3000'
})
    .get('/', () => new Response('Hi'))
    .post('/json', req => req.json().then(toRes))
    .get('/id/:id', req => new Response(
        req.params.id + ' ' + parse(req.url, req.query + 1),
        poweredByBench
    ))
    .use(404);
