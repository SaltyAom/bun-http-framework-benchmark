import { Spear }  from 'tspace-spear'
import { extraRoutes } from '../extra-routes.mjs'
import http  from 'http'

const app = new Spear({
    adapter : http
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
