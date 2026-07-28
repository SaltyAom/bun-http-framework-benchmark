/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import { createReadStream } from 'node:fs'
import { extraRoutes } from '../../../src/extra-routes.mjs'

for (const route of extraRoutes) {
  Route.get(route, () => 'ok')
  Route.post(`${route}/submit`, () => 'ok')
}

Route.get('/', () => 'Hi')
Route.get('/video', ({ response }) => {
  response.header('content-type', 'video/mp4')
  response.stream(createReadStream('public/kyuukurarin.mp4'))
})
Route.get('/id/:id', ({ params, request, response }) => {
  response.header('x-powered-by', 'benchmark')

  return `${params.id} ${request.qs().name}`
})
Route.post('/json', ({ request }) => request.body())
