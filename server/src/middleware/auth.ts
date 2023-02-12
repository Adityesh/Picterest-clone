import { TRPCError } from "@trpc/server";
import { JsonWebTokenError } from "jsonwebtoken";
import { t } from "../trpc";
import jwt from "jsonwebtoken";

export const verifyToken = t.middleware(({ ctx, next }) => {
    try {
        const token = ctx.req.cookies["token"];
        jwt.verify(token, process.env.TOKEN_SECRET as string);
        return next();
    } catch (error) {
        if (error instanceof JsonWebTokenError) {
            throw new TRPCError({
                code: "FORBIDDEN",
                cause: error,
                message: "Forbidden",
            });
        }

        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            cause: error,
            message: "Internal Server Error",
        });
    }
});
