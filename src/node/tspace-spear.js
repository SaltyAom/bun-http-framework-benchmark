const { Spear } = require('tspace-spear')
const { extraRoutes } = require('../extra-routes.mjs')
const uWS = require('uWebSockets.js')
// const net = require('net')
// const http = require('http')

const app = new Spear({
    adapter : uWS // net , http
})
.useBodyParser()

for (const route of extraRoutes) {
    
    app
    .get(route, () => 'ok')
    .post(`${route}/submit`, () => 'ok')
}
  
app.get('/', () => 'Hi')
    .get('/video', ({ res }) => {
        return res.serveMedia('public/kyuukurarin.mp4');
    })
    .get('/id/:id', (ctx) => {
        ctx.res.set('x-powered-by','benchmark');
        return `${ctx.params.id} ${ctx.query.name}`;
    })
    .post('/json',(ctx) => ({ body: ctx.body }))

    .listen(3000)
