import {
    AddCommentSchema,
    DeleteCommentSchema,
    GetCommentSchema,
    LikeCommentSchema,
    UpdateCommentSchema,
} from "~/schema/comment";
import { SUCCESS_MESSAGES } from "~/server/utils/error";
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
                    commentLikes: {
                        select: {
                            commentId: true,
                            userId: true,
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
                    commentLikes: { commentId: string; userId: string }[];
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

    likeComment: protectedProcedure
        .input(LikeCommentSchema)
        .mutation(async ({ ctx: { prisma, session }, input }) => {
            const { commentId, userId } = input;

            const [user, comment, commentLike] = await Promise.all([
                prisma.user.findUniqueOrThrow({ where: { id: userId } }),
                prisma.comment.findUniqueOrThrow({ where: { id: commentId } }),
                prisma.commentLike.findFirst({ where : { commentId, userId }})
            ]);


            if(commentLike === null) {
                // new like from the user
                await prisma.commentLike.create({
                    data: {
                        commentId,
                        userId,
                    },
                });
                return SUCCESS_MESSAGES.LIKE_COMMENT
            }
            
            await prisma.commentLike.delete({
                where : {
                    userId_commentId : input
                }
            })
            return SUCCESS_MESSAGES.UNLIKE_COMMENT;
        }),
});
