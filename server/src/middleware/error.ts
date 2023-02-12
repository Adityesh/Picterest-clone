import { TRPCError } from "@trpc/server";
import { t } from "../trpc";

export const errorMiddleware = t.middleware(({ ctx, next }) => {
    try {
        return next();
    } catch (error) {
        if (error instanceof TRPCError) {
            throw new TRPCError({
                code: error.code,
                cause: error.cause,
                message: error.message,
            });
        }

        if (error instanceof Error) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: error.message,
            });
        }

        throw new Error("Internal server error");
    }
});
