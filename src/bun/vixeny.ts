import fun from "vixeny"

export default {
    fetch: fun({
        hasName: "http://localhost:3000/"
    })(
        [
            {
                path: "/",
                type: "response",
                r : () => new Response("Hi")
            },
            {
                path: "/id/:id",
                headers: { 'x-powered-by': 'benchmark' },
                query: {
                    only: ["name"]
                },
                f : f => f.param.id + " "  + f.query?.name
            },
            {
                path: "/json",
                method: "POST",
                headers: ".json", 
                f : async f =>  JSON.stringify(await f.req.json())
            }
        ]
    )
}
