import { initTRPC } from '@trpc/server';
import { appRouter } from '../routers';
import { Context } from './context';
export const t = initTRPC.context<Context>().create();


export const router = t.router;
export const procedure = t.procedure;

// export type definition of API
export type AppRouter = typeof appRouter;