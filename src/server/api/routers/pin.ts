import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "~/server/api/trpc";

export const pinRouter = createTRPCRouter({
    getPins: publicProcedure
        .input(
            z.object({
                orderBy: z
                    .object({
                        field: z.enum(["title", "createdAt", "updatedAt"]),
                        ordering: z.enum(["asc", "desc"]),
                    })
                    .optional(),
                cursor: z
                    .object({
                        id: z.string(),
                    })
                    .optional(),
                count: z.number({ required_error: "Count is required" }),
                titleFilter: z.string().optional(),
            })
        )
        .query(
            async ({
                ctx: { prisma },
                input: { orderBy, cursor, count, titleFilter },
            }) => {
                return await prisma.pin.findMany({
                    take: count || 5,
                    cursor,
                    where: {
                        title: {
                            contains: titleFilter,
                        },

                    },
                    orderBy: orderBy ? {
                        [orderBy.field]: orderBy.ordering,
                    } : undefined,
                });

                
            }
        ),

    addPin: protectedProcedure
        .input(
            z.object({
                title: z.string(),
                image: z.string().url({ message: "Image must be a url" }),
            })
        )
        .mutation(
            async ({ ctx: { prisma, session }, input: { image, title } }) => {
                const doesUserExist = await prisma.user.findUnique({
                    where: {
                        id: session.user.id,
                    },
                });

                if (!doesUserExist) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "User not found",
                    });
                }

                return await prisma.pin.create({
                    data: {
                        image,
                        title,
                        authorId: session.user.id,
                    },
                });
            }
        ),

    removePin: protectedProcedure
        .input(
            z.object({
                pinId: z.string(),
            })
        )
        .mutation(async ({ ctx: { prisma, session }, input: { pinId } }) => {
            const doesUserExist = await prisma.user.findUnique({
                where: {
                    id: session.user.id,
                },
            });

            if (!doesUserExist) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "User not found",
                });
            }

            const removedPin = await prisma.pin.delete({
                where: {
                    id: pinId,
                },
            });
            return removedPin;
        }),

    updatePin: protectedProcedure
        .input(
            z.object({
                pinId: z.string(),
                title: z.string().optional(),
                image: z.string().url({ message: "Invalid url" }).optional(),
            })
        )
        .mutation(async ({ input, ctx: { prisma, session } }) => {
            const doesUserExist = await prisma.user.findUnique({
                where: {
                    id: session.user.id,
                },
            });

            if (!doesUserExist) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "User not found",
                });
            }
            const { pinId, ...updatedFields } = input;

            return await prisma.pin.update({
                where: {
                    id: input.pinId,
                },
                data: {
                    ...updatedFields,
                },
            });
        }),

    getPinInDetail : protectedProcedure
        .input(z.object({
            pinId : z.string(),
        }))
        .mutation(async ({ ctx : { prisma, session }, input : { pinId } }) => {
            const doesUserExist = await prisma.user.findUnique({
                where: {
                    id: session.user.id,
                },
            });

            if (!doesUserExist) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "User not found",
                });
            }

            return await prisma.pin.findUnique({
                where : {
                    id : pinId
                },
                include : {
                    author : true,
                    likes : true,
                }
            })
        })
});
