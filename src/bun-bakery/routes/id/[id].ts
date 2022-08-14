import { Context } from '@kapsonfire/bun-bakery'

const xPoweredBy = 'benchmark'

export function GET(ctx: Context) {
    ctx.sendResponse(
        new Response(`${ctx.params.id} ${ctx.url.searchParams.get('name')}`, {
            headers: {
                'x-powered-by': xPoweredBy
            }
        })
    )
}
