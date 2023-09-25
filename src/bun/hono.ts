import { Hono } from 'hono';

// Using RegExp is slower in JSC
// Instead we let the SmartRouter to choose the best router to use
export default new Hono()
    .get('/', c => c.text('Hi'))
    .post('/json', c => c.req.json().then(c.json))
    .get('/id/:id', c => {
        c.header('x-powered-by', 'benchmark');
        
        return c.text(c.req.param('id') + ' ' + c.req.query('name'));
    });
