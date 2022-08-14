import { Context } from '@kapsonfire/bun-bakery'

export function GET(ctx: Context) {
    ctx.sendResponse(new Response('Hi'))
}
