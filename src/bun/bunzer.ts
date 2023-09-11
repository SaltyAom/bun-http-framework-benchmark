import {serve, get, post, response} from 'bunzer'

get('/',       req => 'hi')
get('/id/:id', req => response(`${req.params.id} ${req.query.name}`, {headers: {'x-powered-by': 'benchmark'}}))
post('/json',  req => response(req.body, {content_type: 'application/json'}))

serve({port: 3000})