const jsonHeaders = { headers: {'Content-Type': 'application/json'} },
    queryHeaders = { headers: {'x-powered-by': 'benchmark'} },
    notFound = { status: 404 };

Bun.serve({
    fetch(req): Response | Promise<Response> {
        const url = req.url, 
            pathIndex = req.url.indexOf('/', 12) + 1,
            queryIndex = req.url.indexOf('?', pathIndex),
            path = queryIndex === -1 
                ? req.url.substring(pathIndex)
                : req.url.substring(pathIndex, queryIndex);

        switch (path) {
            case '':
                if (req.method === 'GET') 
                    return new Response('Hi');
                break;
            case 'json':
                if (req.method === 'POST')
                    return req.json().then(toResponse);
                break;
            default:
                if (path.startsWith('id/')) 
                    return new Response(
                        path.substring(3) + ' ' + new URLSearchParams(
                            req.url.substring(queryIndex + 1)
                        ).get('name'), queryHeaders
                    );
                break;
        }

        return new Response(null, notFound);
    }
});
