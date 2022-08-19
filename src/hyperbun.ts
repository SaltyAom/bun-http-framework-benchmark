import {createServer} from "hyperbun";

const app = createServer();

app.get('/', () => 'Hi');

app.post('/json',
  async (request) => await request.json()
)

app.get('/id/:id', (_, context) => {
  const id = context.params.id;
  const name = context.query.name;

  return new Response(`${id} ${name}`, {
    headers: {
      'x-powered-by': 'benchmark',
    },
  });
});

app.listen({
  port: 3000
});