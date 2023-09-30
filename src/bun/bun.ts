const queryHeaders = { headers: {'x-powered-by': 'benchmark'} },
    notFound = { status: 404 },
    jsonHeader = { headers: { 'Content-Type': 'application/json' } };

function jsonRes(d: any) {
    return new Response(JSON.stringify(d), jsonHeader);
}

Bun.serve({
    fetch(req): Response | Promise<Response> {
        const pathIndex = req.url.indexOf('/', 12) + 1;
        if (pathIndex === req.url.length)
            if (req.method === 'GET') 
                return new Response('Hi');
        
        let queryIndex = req.url.indexOf('?', pathIndex),
            path = queryIndex === -1 
                ? req.url.substring(pathIndex)
                : req.url.substring(pathIndex, queryIndex);

        if (path === 'json') {
            if (req.method === 'POST') return req.json().then(jsonRes);
        } else if (path.startsWith('id/'))
            if (req.method === 'GET') {
                path = path.substring(3);
                
                if (queryIndex === -1)
                    return new Response(path);

                let nameStart = req.url.indexOf('name=', queryIndex + 1);
                if (nameStart === -1)
                    return new Response(path);

                nameStart += 5;
                const nameEnd = req.url.indexOf('&', nameStart);

                return new Response(path + ' ' + (nameEnd === -1 
                    ? req.url.substring(nameStart) 
                    : req.url.substring(nameStart, nameEnd)
                ), queryHeaders);
            }

        return new Response(null, notFound);
    }
});
