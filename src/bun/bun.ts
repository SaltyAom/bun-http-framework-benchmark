const jsonHeaders = { headers: {'Content-Type': 'application/json'} },
    queryHeaders = { headers: {'x-powered-by': 'benchmark'} },
    notFound = { status: 404 };
function toResponse(json: any) {
    return new Response(JSON.stringify(json), jsonHeaders);
}

const dynamicPath = '/id/', dynamicPathLen = dynamicPath.length;
Bun.serve({
    fetch(req): Response | Promise<Response> {
        const url = req.url, 
            pathIndex = url.indexOf('/', 12),
            queryIndex = url.indexOf('?', pathIndex + 1),
            path = queryIndex === -1 
                ? url.substring(pathIndex)
                : url.substring(pathIndex, queryIndex),
            method = req.method;

        switch (path) {
            case '/':
                if (method === 'GET') 
                    return new Response('Hi');
                break;
            case '/json':
                if (method === 'POST')
                    return req.json().then(toResponse);
                break;
            default:
                if (path.startsWith(dynamicPath)) 
                    return new Response(
                        path.substring(dynamicPathLen) + ' ' + new URLSearchParams(
                            url.substring(queryIndex + 1)
                        ).get('name'), queryHeaders
                    );
                break;
        }

        return new Response(null, notFound);
    }
});
