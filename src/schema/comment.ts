import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { z } from 'zod';
import { AppRouter } from '~/server/api/root';

type RouterInput = inferRouterInputs<AppRouter>;
type RouterOutput = inferRouterOutputs<AppRouter>;

export const AddCommentSchema = z.object({
    text : z.string({ required_error : "Comment cannot be empty"}),
    pinId : z.string({ required_error : "Comment must refer a pin"}),
    userId : z.string({ required_error : "Comment must be made by an user"}),
    parentId : z.string().optional()
})

export type AddCommentType = z.TypeOf<typeof AddCommentSchema>;

export const GetCommentSchema = z.object({
    pinId : z.string({ required_error : "Pin id is required to fetch comments"})
})

export type GetCommentType = z.TypeOf<typeof GetCommentSchema>;


export type GetCommentsQueryType = RouterOutput['comment']['getComments'];
export type CommentsListType = GetCommentsQueryType['comments'][string]
export type CommentType = CommentsListType[number]


export const DeleteCommentSchema = z.object({
    commentId : z.string({ required_error : "Comment id is required to delete a comment"})
})

export type DeleteCommentType = z.TypeOf<typeof DeleteCommentSchema>;


export const UpdateCommentSchema = z.object({
    commentId : z.string({ required_error : "Comment cannot be edited without the id"}),
    text : z.string({ required_error : "Updated text is required"})
})

export type UpdateCommentType = z.TypeOf<typeof UpdateCommentSchema>;

export const LikeCommentSchema = z.object({
    commentId : z.string({ required_error : "Comment id is required for liking the comment"}),
    userId : z.string({ required_error : "User id of the user who is liking the comment is required"})
})

export type LikeCommentType = z.TypeOf<typeof LikeCommentSchema>;
