import {
    AddCommentSchema,
    DeleteCommentSchema,
    GetCommentSchema,
    LikeCommentSchema,
    UpdateCommentSchema,
} from "~/schema/comment";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const commentRouter = createTRPCRouter({
    addComment: protectedProcedure
        .input(AddCommentSchema)
        .mutation(async ({ ctx: { prisma, session }, input }) => {
            const { pinId, userId, parentId, text } = input;
            await Promise.all([
                prisma.pin.findUniqueOrThrow({
                    where: {
                        id: pinId,
                    },
                }),
                prisma.user.findUniqueOrThrow({
                    where: {
                        id: userId,
                    },
                }),
            ]);

            const comment = await prisma.comment.create({
                data: {
                    text,
                    parentId,
                    pinId,
                    userId,
                },
            });

            return comment;
        }),

    getComments: publicProcedure
        .input(GetCommentSchema)
        .query(async ({ ctx: { prisma, session }, input }) => {
            const result = await prisma.comment.findMany({
                where: {
                    pinId: input.pinId,
                },
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    id: true,
                    parentId: true,
                    pinId: true,
                    createdAt: true,
                    updatedAt: true,
                    text: true,
                    user: {
                        select: {
                            id: true,
                            image: true,
                            name: true,
                        },
                    },
                },
            });

            const group: {
                [key: string]: {
                    text: string;
                    user: {
                        image: string | null;
                        id: string;
                        name: string | null;
                    };
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    pinId: string;
                    parentId: string | null;
                }[];
            } = {};
            result.forEach((comment) => {
                group[String(comment.parentId)] =
                    group[String(comment.parentId)] || [];
                group[String(comment.parentId)]?.push(comment);
            });
            return {
                comments: group,
                count: result.length,
            };
        }),

    deleteComment: protectedProcedure
        .input(DeleteCommentSchema)
        .mutation(async ({ ctx: { prisma, session }, input }) => {
            await prisma.comment.delete({
                where: {
                    id: input.commentId,
                },
            });
            return true;
        }),

    updateComment: protectedProcedure
        .input(UpdateCommentSchema)
        .mutation(async ({ ctx: { prisma, session }, input }) => {
            const updatedComment = await prisma.comment.update({
                data: {
                    text: input.text,
                },
                where: {
                    id: input.commentId,
                },
            });

            return true;
        }),
    
    
    likeComment : protectedProcedure
    .input(LikeCommentSchema)
    .mutation(async ({ ctx: { prisma, session }, input }) => {
        
    })
});
