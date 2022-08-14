import { Context } from '@kapsonfire/bun-bakery'

export async function POST(ctx: Context) {
    ctx.sendAsJson(await ctx.request.json())
}
