
import { Application } from 'xirelta';

const app = new Application({
	web: {
		port: Number(process.env.PORT ?? '3000'),
	},
});

const xPoweredBy = "benchmark"

app.get('/', () => 'Hi');
app.post('/json', request => JSON.stringify(request.body));

app.get("/id/:id", request => {
	const id = request.params?.id;
	const name = request.query?.name;

	return new Response(`${id} ${name}`, {
		headers: {
			"x-powered-by": xPoweredBy,
		}
	});
});

void app.start();
