import { useRouter } from "next/router";
import { api } from "~/utils/api";
import styles from "./PinDetail.module.scss";
import { AiOutlineHeart, AiFillHeart, AiOutlineComment } from "react-icons/ai";
import {
    Avatar,
    Divider,
    LoadingOverlay,
    Progress,
    Skeleton,
} from "@mantine/core";
import { useState, useMemo, useCallback } from "react";
import Head from "next/head";
import { dateFormatter } from "~/utils/functions";
import CommentInput from "~/components/Comment/CommentInput";
import { GetCommentsQueryType } from "~/schema/comment";
import CommentList from "~/components/Comment/CommentList";

export default function PinDetail() {
    const {
        query: { id },
    } = useRouter();
    const [imgLoading, setImgLoading] = useState(true);
    const [imgError, setImgError] = useState(false);
    const { isLoading, data } = api.pin.fetchPinDetail.useQuery(
        {
            pinId: id as string,
        },
        {
            cacheTime: 30 * 1000 * 60,
            staleTime: 30 * 60 * 1000,
        }
    );
    const { isLoading: isCommentsLoading, data: result } =
        api.comment.getComments.useQuery({
            pinId: id as string,
        });
    const { count, comments } = result || { count : 0, comments : {}};

    const getCommentsByParentId = useCallback(
        (parentId: string) => {
            if (!comments) return [];
            return comments[parentId];
        },
        [comments, id]
    );

    return (
        <>
            <Head>
                <title>Picterest - {data?.title}</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.container}>
                {isLoading && <Progress animate value={100} />}
                <div className={styles.contentContainer}>
                    <LoadingOverlay
                        visible={isLoading || imgLoading}
                        overlayBlur={5}
                        sx={{
                            "& > div > div": {
                                backgroundColor: "rgba(0,0,0, 0.5) !important",
                            },
                        }}
                    />
                    <Skeleton
                        visible={imgLoading}
                        sx={{
                            "&::before": {
                                backgroundColor: "#8BC6EC",
                                backgroundImage: `linear-gradient(135deg, #8BC6EC 0%, #9599E2 100%)`,
                            },
                        }}
                    >
                        <img
                            src={data?.image}
                            style={{ width: imgLoading ? "300px" : undefined }}
                            onLoad={() => setImgLoading(false)}
                            onError={() => setImgError(true)}
                        />
                    </Skeleton>
                    <p className={styles.pinTitle}>{data?.title || ""}</p>
                    <div className={styles.pinAuthor}>
                        <Avatar src={data?.author?.image} />
                        <span>{data?.author.name || ""}</span>
                    </div>
                    <p className={styles.pinDate}>
                        {dateFormatter(data?.createdAt!)}
                    </p>

                    <div className={styles.commentOptions}>
                        <div className={styles.left}>
                            <AiOutlineHeart size="1.75rem" />
                            <span>{0}</span>
                        </div>
                        <div className={styles.right}>
                            <AiOutlineComment size="1.75rem" />
                            <span>{count}</span>
                        </div>
                    </div>
                    <Divider />

                    <CommentInput pinId={data?.id!} />
                    <CommentList
                        isNested={false}
                        comments={!comments ? [] : comments["null"]! || []}
                    />
                </div>
            </div>
        </>
    );
}
