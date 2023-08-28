import { Router, macro } from '@stricjs/router';
import { qs, writeHead } from '@stricjs/utils';

const toRes = Response.json, parse = qs.searchKey('name'), send = writeHead({ 
    headers: { 'x-powered-by': 'benchmark' } 
});

export default new Router({ base: 'http://localhost:3000' })
    .get('/', macro('Hi'))
    .post('/json', ctx => ctx.json().then(toRes))
    .get('/id/:id', ctx => send(ctx.params.id + ' ' + parse(ctx)))
    .use(404);
