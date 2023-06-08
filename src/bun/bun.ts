/// <reference types='bun-types' />
import Bun from 'bun';

const notFound = { status: 404 };
const json = {
    headers: {
        'content-type': 'application/json'
    }
}
const query = {
    headers: {
        'x-powered-by': 'benchmark'
    }
}
const paramPath = '/id/';

// Serve the server
export default {
    port: 3000,
    async fetch(req) {
        // The path to check
        let path: string;
        // The request query string
        const method = req.method;

        // This part parses the path and the query
        const url = req.url;
        const pathStart = url.indexOf('/', 12);
        const pathEnd = url.indexOf('?', pathStart + 1);

        if (pathEnd === -1) {
            path = url.substring(pathStart);
        } else 
            path = url.substring(pathStart, pathEnd);

        // Handle static routes
        switch (path) {
            // Handle GET request to '/'
            case '/':
                if (method === 'GET')
                    return new Response('Hi');
                return new Response('', notFound);
            // Handle POST request to '/json'
            case '/json':
                if (method === 'POST')
                    return new Response(
                        JSON.stringify(await req.json()), json
                    );
                return new Response('', notFound);
            // Handle GET request to '/id/...'
            default:
                if (method === 'GET') {
                    // Check param 
                    const param = path.indexOf(paramPath);
                    if (param === -1)
                        return new Response('', notFound);

                    if (pathEnd === -1) 
                        return new Response(path.substring(param + 4));

                    return new Response(
                        path.substring(param + 4) + ' ' +
                        new URLSearchParams(
                            url.substring(pathEnd + 1)
                        ).get('name'), query
                    );
                }
                return new Response('', notFound);
        }
    }
} as Bun.ServeOptions;

// This shows how hard it is to code a fast server without using a framework
// I like Stric and Elysia
