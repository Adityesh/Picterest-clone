import styles from "./Comment.module.scss";
import { KeyboardEvent, useState } from "react";
import { api } from "~/utils/api";
import { showToast } from "~/utils/functions";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "~/utils/message";
import { useSession } from "next-auth/react";

type CommentInputProps = {
    pinId: string;
    parentId?: string;
    handleAfterCommentAdd?: () => any;
    handleInputBlur?: () => any;
    isEdit?: boolean;
    text?: string;
    commentId?: string;
};

export default function CommentInput(props: CommentInputProps) {
    const { data: sessionData } = useSession();
    const canPerformActions = sessionData !== null;
    const utils = api.useContext();
    const { pinId, parentId } = props;
    const { mutateAsync: addComment } = api.comment.addComment.useMutation();

    const { mutateAsync: updateComment } =
        api.comment.updateComment.useMutation();

    const [text, setText] = useState(props.text || "");

    const handleAddComment = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && e.shiftKey === false) {
            try {
                if (text.length === 0) {
                    showToast(ERROR_MESSAGES.REQUIRED_COMMENT_INPUT, "error");
                    return;
                }
                if (props.isEdit) {
                    // Comment is being edited
                    await updateComment({
                        commentId: props.commentId!,
                        text,
                    });
                    showToast(SUCCESS_MESSAGES.UPDATE_COMMENT, "default");
                    return;
                }
                // New comment is being added
                await addComment({
                    pinId,
                    text,
                    userId: sessionData?.user.id!,
                    parentId,
                });

                showToast(SUCCESS_MESSAGES.ADD_COMMENT, "default");
            } catch (error) {
                if (props.isEdit) {
                    showToast(ERROR_MESSAGES.UPDATE_COMMENT, "error");
                }
                showToast(ERROR_MESSAGES.ADD_COMMENT, "error");
            } finally {
                setText("");
                utils.comment.getComments.invalidate();
                props.handleAfterCommentAdd?.();
            }
        }
    };

    return (
        <div className={styles.commentInputContainer}>
            <form>
                <textarea
                    value={text}
                    disabled={!canPerformActions}
                    placeholder={
                        canPerformActions ? "" : "Please login to comment"
                    }
                    onKeyDown={
                        canPerformActions ? handleAddComment : () => null
                    }
                    onChange={
                        canPerformActions
                            ? (e) => setText(e.target.value)
                            : () => null
                    }
                    className={styles.commentInput}
                    onBlur={
                        canPerformActions ? props.handleInputBlur : () => null
                    }
                />
            </form>
        </div>
    );
}
