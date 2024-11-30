import { router, jitc } from '@mapl/app';

const id = router()
  .headers({ 'x-powered-by': 'benchmark' })
  .get('/:id', (c) => `${c.params[0]} ${new URL(c.req.url).searchParams.get('name')}`)

const app = router()
  .build('/', () => 'Hi')
  .post('/json', {
    type: 'json',
    fn: async (c) => c.req.json()
  })
  .route('/id', id);

export default
  await jitc(app, { exposeStatic: true });
