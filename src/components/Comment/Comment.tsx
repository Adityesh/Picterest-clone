import { Avatar, Loader } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useMemo, useState, memo } from "react";
import { GoPrimitiveDot } from "react-icons/go";
import { CommentType } from "~/schema/comment";
import { api } from "~/utils/api";
import { dateFormatter, showToast } from "~/utils/functions";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "~/utils/message";
import styles from "./Comment.module.scss";
import CommentInput from "./CommentInput";
import CommentList from "./CommentList";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

type CommentProps = {
    comment: CommentType;
};

function Comment({
    comment: {
        text,
        user: { name, image, id: userId },
        createdAt,
        id: commentId,
        commentLikes,
    },
}: CommentProps) {
    const { id } = useRouter().query;
    const { data: session } = useSession();
    const canCommentActions = session != null && userId === session?.user.id;

    const [reply, setReply] = useState(false);

    const [edit, setEdit] = useState(false);
    const [editVal, setEditVal] = useState(text);

    const utils = api.useContext();

    const { data, isLoading } = api.comment.getComments.useQuery({
        pinId: id as string,
    });

    const { isLoading: isDeleting, mutateAsync: deleteComment } =
        api.comment.deleteComment.useMutation({
            onSuccess: () => utils.comment.getComments.invalidate(),
        });

    const { isLoading: isLikeLoading, mutateAsync: toggleCommentLike } =
        api.comment.likeComment.useMutation({
            onSuccess: () => utils.comment.getComments.invalidate(),
        });

    const childComments = useMemo(() => {
        const { comments } = data || { count: 0, comments: {} };
        return comments[commentId];
    }, [commentId, data]);

    const hasUserLikedComment = useMemo(() => {
        if (commentLikes.length === 0) return false;
        return commentLikes.some(
            (comment) => comment.userId === session?.user.id
        );
    }, [commentLikes]);

    const handleDeleteComment = async () => {
        try {
            const result = await deleteComment({
                commentId,
            });

            if (result) {
                showToast(SUCCESS_MESSAGES.DELETE_COMMENT, "default");
            }
        } catch (error) {
            showToast(ERROR_MESSAGES.DELETE_COMMENT, "error");
        }
    };

    const handleLikeComment = async () => {
        try {
            const result = await toggleCommentLike({
                commentId,
                userId: session?.user.id as string,
            });
            showToast(result, "default");
        } catch (error) {
            showToast(ERROR_MESSAGES.ACTION, "error");
        }
    };

    return (
        <>
            <div className={styles.commentContainer}>
                <div className={styles.commentHeader}>
                    <div className={styles.left}>
                        <Avatar src={image} size="md" />
                        <div className={styles.commentMeta}>
                            <span className={styles.commentAuthor}>{name}</span>
                            <div>
                                <span className={styles.commentLikes}>
                                    {commentLikes.length} likes
                                </span>
                                <GoPrimitiveDot
                                    className={styles.commentHeaderDot}
                                    color="#bebfc2"
                                    size="0.65rem"
                                />
                                <span className={styles.commentDate}>
                                    {dateFormatter(createdAt)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                {!edit && <div className={styles.commentBody}>{text}</div>}
                {edit && (
                    <CommentInput
                        isEdit={edit}
                        pinId={id as string}
                        handleAfterCommentAdd={() => setEdit(false)}
                        commentId={commentId}
                        text={text}
                    />
                )}
                <div className={styles.commentFooter}>
                    {session !== null && !reply && (
                        <a
                            onClick={() => setReply((reply) => !reply)}
                            style={{ color: "#3F88C5" }}
                        >
                            Reply
                        </a>
                    )}
                    {canCommentActions && (
                        <>
                            <a
                                style={{ color: "red" }}
                                onClick={handleDeleteComment}
                            >
                                Delete
                            </a>
                            <a
                                style={{ color: "green" }}
                                onClick={() => setEdit((edit) => !edit)}
                            >
                                {edit ? "Cancel" : "Edit"}
                            </a>
                            {isLikeLoading ? (
                                <Loader size={"sm"} />
                            ) : (
                                <>
                                    {hasUserLikedComment ? (
                                        <AiFillHeart
                                            onClick={handleLikeComment}
                                            color="red"
                                            size={"1.15rem"}
                                            className={styles.commentLikeBtn}
                                        />
                                    ) : (
                                        <AiOutlineHeart
                                            onClick={handleLikeComment}
                                            className={styles.commentLikeBtn}
                                            size={"1.15rem"}
                                        />
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>

                {reply && (
                    <CommentInput
                        pinId={id as string}
                        parentId={commentId}
                        handleAfterCommentAdd={() => setReply(false)}
                    />
                )}
            </div>
            {childComments && childComments?.length > 0 && (
                <CommentList comments={childComments} isNested={true} />
            )}
        </>
    );
}

export default memo(Comment);
