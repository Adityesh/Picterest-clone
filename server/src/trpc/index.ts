import { initTRPC } from "@trpc/server";
import { appRouter } from "../routers";
import { Context } from "./context";
import { verifyToken } from "../middleware/auth";
import { errorMiddleware } from "../middleware/error";
export const t = initTRPC.context<Context>().create();

export const router = t.router;
export const procedure = t.procedure
// .use(errorMiddleware);
export const privateProcedure = t.procedure
    // .use(verifyToken)
    // .use(errorMiddleware);

// export type definition of API
export type AppRouter = typeof appRouter;
