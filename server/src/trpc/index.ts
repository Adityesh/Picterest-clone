import { initTRPC } from '@trpc/server';
import { appRouter } from '../routers';
export const t = initTRPC.create();


export const router = t.router;
export const procedure = t.procedure;

// export type definition of API
export type AppRouter = typeof appRouter;