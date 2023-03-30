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
    Loader,
} from "@mantine/core";
import { useState, useMemo } from "react";
import Head from "next/head";
import { dateFormatter, showToast } from "~/utils/functions";
import CommentInput from "~/components/Comment/CommentInput";
import CommentList from "~/components/Comment/CommentList";
import { useSession } from "next-auth/react";
import { ERROR_MESSAGES } from "~/utils/message";

export default function PinDetail() {
    const { data: sessionData } = useSession();
    const {
        query: { id },
    } = useRouter();
    const [imgLoading, setImgLoading] = useState(true);
    const [imgError, setImgError] = useState(false);
    const {
        isLoading,
        data,
        refetch: fetchPin,
    } = api.pin.fetchPinDetail.useQuery(
        {
            pinId: id as string,
        },
        {
            cacheTime: 30 * 1000 * 60,
            staleTime: 30 * 60 * 1000,
        }
    );
    const { isLoading: isCommentsLoading, data: result } =
        api.comment.getComments.useQuery(
            {
                pinId: id as string,
            },
            {
                staleTime: 5 * 60 * 1000,
            }
        );

    const { isLoading: isLikeLoading, mutateAsync: togglePinLikeAsync } =
        api.pin.likePin.useMutation({
            onSuccess: () => {
                fetchPin();
            },
            onError: () => {
                showToast(ERROR_MESSAGES.LIKE_PIN, "error");
            },
        });

    const { count, comments } = result || { count: 0, comments: {} };

    const hasUserLikedPin = useMemo(() => {
        const likes = data?.likes;
        if (!likes) return false;
        return likes.some((like) => like.userId === sessionData?.user.id);
    }, [data?.likes, sessionData?.user.id]);

    const handleLikePin = () => {
        try {
            togglePinLikeAsync({
                pinId: id as string,
                userId: sessionData?.user.id!,
            });
            showToast(
                `Pin ${hasUserLikedPin ? "unliked" : "liked"} successfully`,
                "default"
            );
        } catch (error) {
            showToast(ERROR_MESSAGES.LIKE_PIN, "error");
        }
    };

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
                            {isLikeLoading ? (
                                <Loader size="md" />
                            ) : (
                                <>
                                    {hasUserLikedPin ? (
                                        <AiFillHeart
                                            size="1.75rem"
                                            onClick={handleLikePin}
                                        />
                                    ) : (
                                        <AiOutlineHeart
                                            size="1.75rem"
                                            onClick={handleLikePin}
                                        />
                                    )}
                                </>
                            )}
                            <span>{data?.likes.length}</span>
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