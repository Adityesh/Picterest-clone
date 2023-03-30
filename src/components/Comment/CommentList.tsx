import { useRouter } from "next/router";
import { api } from "~/utils/api";
import styles from "./Comment.module.scss";
import Comment from "./Comment";
import { CommentsListType } from "~/schema/comment";
import { useState, memo } from "react";
import { MdExpandMore } from "react-icons/md";

type CommentListProps = {
    comments: CommentsListType;
    isNested: boolean;
};

function CommentList({ comments, isNested }: CommentListProps) {
    const { id } = useRouter().query;
    const [isListHidden, setListHidden] = useState(false);
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    const { data } = api.comment.getComments.useQuery({
        pinId: id as string,
    });

    return (
        <>
            {isListHidden && (
                <MdExpandMore
                    style={{ cursor: "pointer" }}
                    size="1.45rem"
                    color={"white"}
                    onClick={() => setListHidden(false)}
                />
            )}
            <div
                // style={{ visibility: isListHidden ? "hidden" : "inherit" }}
                className={`${styles.commentListContainer} ${
                    isNested && styles.nestedCommentsList
                } ${isListHidden ? styles.listHidden : styles.listVisible}`}
            >
                {isNested && !isListHidden && (
                    <a
                        onClick={() => setListHidden((list) => !list)}
                        className={styles.commentsToggle}
                        style={{
                            background: randomColor,
                        }}
                    ></a>
                )}
                {comments.map((comment, index) => {
                    return <Comment comment={comment} key={index} />;
                })}
            </div>
        </>
    );
}

export default memo(CommentList);
