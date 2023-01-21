import { Router } from "@bunsvr/router";

const route = new Router();

route.use({
    method: "GET",
    path: "/",
    run: () => new Response("Hi")
});

route.use({
    method: "GET",
    path: "/id/:id",
    run(req, _, params) {
        const name = new URL(req.url).searchParams.get("name");
        return new Response(`${params.id} ${name}`, {
            headers: {
                "x-powered-by": "benchmark"
            }
        });
    }
});

route.use({
    method: "POST",
    path: "/json",
    async run(req) {
        return new Response(await req.text());
    }
});

route.serve();
