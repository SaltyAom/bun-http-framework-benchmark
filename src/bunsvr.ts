import { Router } from "@bunsvr/router";

// Get all query string
const slicer = /\?(.+)/;

new Router()
    .static("GET", "/", () => new Response("hi"))
    .static("POST", "/json", async req =>
        new Response(JSON.stringify(await req.json()), {
            headers: { "content-type": "application/json" }
        })
    )
    .dynamic("GET", "/id/:id", async req => 
        new Response(`${req.params?.[1]} ${
            // Get name parameter from the query params
            new URLSearchParams(
                slicer.exec(req.url)?.[1]
            ).get("name")
        }`, {
            headers: { "x-powered-by": "benchmark" }
        })
    )
    .serve();
