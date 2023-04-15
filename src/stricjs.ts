import { Router } from "@stricjs/router";
import { URLParser } from "@stricjs/utils";

new Router()
    .static("GET", "/", () => new Response("hi"))
    .static("POST", "/json", async req =>
        new Response(JSON.stringify(await req.json()), {
            headers: { "content-type": "application/json" }
        })
    )
    .dynamic("GET", "/id/:id", req => {
        const name = new URLSearchParams(
            URLParser.query(req.url)
        ).get("name");

        return new Response(`${req.params[1]} ${name}`, {
            headers: { "x-powered-by": "benchmark" }
        })
    }).serve();
