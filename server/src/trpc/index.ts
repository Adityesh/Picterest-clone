import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
export const t = initTRPC.create();

export const appRouter = t.router({

});
// export type definition of API
export type AppRouter = typeof appRouter;