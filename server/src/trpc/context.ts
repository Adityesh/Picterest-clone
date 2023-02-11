import * as trpc from '@trpc/server'
import * as trpcExpress from '@trpc/server/adapters/express'

export async function  createContext(ctx : trpcExpress.CreateExpressContextOptions) {
    const { req, res } = ctx; 
    return {
        req,
        res
    }
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>;