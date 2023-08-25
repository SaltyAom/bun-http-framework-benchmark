const jsonHeaders = { headers: {'Content-Type': 'application/json'} },
    queryHeaders = { headers: {'x-powered-by': 'benchmark'} },
    notFound = { status: 404 };

Bun.serve({
    fetch(req): Response | Promise<Response> {
        const pathIndex = req.url.indexOf('/', 12) + 1;
        if (pathIndex === req.url.length)
            if (req.method === 'GET') 
                return new Response('Hi');
        
        const queryIndex = req.url.indexOf('?', pathIndex),
            path = queryIndex === -1 
                ? req.url.substring(pathIndex)
                : req.url.substring(pathIndex, queryIndex);

        if (path === 'json') {
            if (req.method === 'POST') return req.json().then(toResponse);
        } else if (path.startsWith('id/')) 
            return new Response(
                path.substring(3) + ' ' + new URLSearchParams(
                    req.url.substring(queryIndex + 1)
                ).get('name'), queryHeaders
            );

        return new Response(null, notFound);
    }
});
