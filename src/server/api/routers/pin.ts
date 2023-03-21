import { TRPCError } from "@trpc/server";
import {
    createTRPCRouter, protectedProcedure, publicProcedure
} from "~/server/api/trpc";
import {
    AddPinSchema,
    GetPinInDetailSchema,
    GetPinSchema,
    RemovePinSchema,
    UpdatePinSchema
} from "../../../schema/pin";

export const pinRouter = createTRPCRouter({
    getPins: publicProcedure
        .input(GetPinSchema)
        .query(
            async ({
                ctx: { prisma },
                input: { orderBy, cursor, count, titleFilter },
            }) => {
                const items = await prisma.pin.findMany({
                    take: (count ?? 5) + 1,
                    cursor: cursor ? { id: cursor } : undefined,
                    where: {
                        title: {
                            contains: titleFilter,
                        },
                    },
                    orderBy: orderBy
                        ? {
                              [orderBy.field]: orderBy.ordering,
                          }
                        : undefined,
                });

                let nextCursor: typeof cursor | undefined = undefined;
                if (items.length > count) {
                    const nextItem = items.pop();
                    nextCursor = nextItem?.id;
                }
                return {
                    items,
                    nextCursor,
                };
            }
        ),

    addPin: protectedProcedure
        .input(AddPinSchema)
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
        .input(RemovePinSchema)
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
        .input(UpdatePinSchema)
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

    getPinInDetail: publicProcedure
        .input(GetPinInDetailSchema)
        .query(async ({ ctx: { prisma, session }, input: { pinId } }) => {
            return await prisma.pin.findUnique({
                where: {
                    id: pinId,
                },
                include: {
                    author: true,
                    likes: true,
                },
            });
        }),
});
