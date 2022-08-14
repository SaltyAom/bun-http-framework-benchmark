import { Router } from '@kapsonfire/bun-bakery'

new Router({
    port: 3000,
    routesPath: import.meta.dir + '/routes/'
})
