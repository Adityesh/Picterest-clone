import { useRouter } from "next/router";
import { api } from "~/utils/api";
import styles from "./Comment.module.scss";
import Comment from "./Comment";
import { CommentsListType } from "~/schema/comment";

type CommentListProps = {
    comments : CommentsListType,
    isNested : boolean
}

export default function CommentList({ comments, isNested } : CommentListProps) {
    const { id } = useRouter().query;

    const { data } = api.comment.getComments.useQuery({
        pinId: id as string,
    });

    return (
        <div
            className={`${styles.commentListContainer} ${isNested && styles.nestedCommentsList}`}
        >
            {comments.map((comment, index) => {
                return <Comment comment={comment} key={index} />;
            })}
        </div>
    );
}
