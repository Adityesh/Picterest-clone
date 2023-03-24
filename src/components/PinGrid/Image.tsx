import { useRef, useState, memo, useMemo } from "react";
import { type Pin } from "@prisma/client";
import { api } from "~/utils/api";
import {
    AiFillHeart,
    AiOutlineHeart,
    AiOutlineFieldTime,
} from "react-icons/ai";
import { TbError404 } from "react-icons/tb";
import styles from "./PinGrid.module.scss";
import { Skeleton } from "@mantine/core";
import { showToast } from "~/utils/functions";
import { ERROR_MESSAGES } from "~/utils/message";
import { Loader } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';

function Image(props: Pin) {
    const router = useRouter();
    const [imgLoading, setImgLoading] = useState(true);
    const [imgError, setImgError] = useState(false);
    const overlayRef = useRef<HTMLDivElement>(null);
    const { data: sessionData } = useSession();

    const { refetch: fetchPin, data } = api.pin.getPinInDetail.useQuery(
        {
            pinId: props.id,
        },
        {
            enabled: false,
            staleTime: 1000 * 60 * 10,
            cacheTime: 5 * 60 * 1000,
            onError: (err) => {
                showToast(ERROR_MESSAGES.SINGLE_PIN_FETCH, "error");
            },
        }
    );

    const hasUserLikedPin = useMemo(() => {
        const likes = data?.likes;
        if (!likes) return false;
        return likes.some((like) => like.userId === sessionData?.user.id);
    }, [data?.likes, sessionData?.user.id]);

    const { isLoading: isLikeLoading, mutateAsync: togglePinLikeAsync } =
        api.pin.likePin.useMutation({
            onSuccess: () => {
                fetchPin();
            },
            onError: () => {
                showToast(ERROR_MESSAGES.LIKE_PIN, "error");
            },
        });

    const handleFetchData = () => {
        fetchPin();
    };

    const handlePinLike = () => {
        try {
            togglePinLikeAsync({
                pinId: props.id,
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
        <div className={styles.imageContainer} onMouseEnter={handleFetchData}>
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
                    src={props.image}
                    className={styles.pinImage}
                    loading="lazy"
                    decoding="async"
                    key={props.id}
                    onLoad={() => setImgLoading(false)}
                    onError={() => setImgError(true)}
                />
            </Skeleton>

            {!imgLoading && (
                <>
                    <div className={styles.overlay} ref={overlayRef} onClick={() => router.push('/pin/' + props.id)}>
                        <div className={styles.overlayContent}>
                            <p className={styles.overlayTitle}>{data?.title}</p>
                            <div>
                                <img
                                    src={data?.author.image || ""}
                                    loading="lazy"
                                />
                                <p>{data?.author.name}</p>
                            </div>
                            <div className={styles.overlayFooter}>
                                <div>
                                    <AiOutlineFieldTime fontSize={"1.5rem"} />
                                    <p>{data?.createdAt.toDateString()}</p>
                                </div>
                                {sessionData?.user && (
                                    <div>
                                        {isLikeLoading ? (
                                            <Loader size="sm" />
                                        ) : (
                                            <>
                                                {hasUserLikedPin ? (
                                                    <AiFillHeart
                                                        fontSize={"1.5rem"}
                                                        onClick={handlePinLike}
                                                    />
                                                ) : (
                                                    <AiOutlineHeart
                                                        fontSize={"1.5rem"}
                                                        onClick={handlePinLike}
                                                    />
                                                )}
                                                <p>{data?.likes.length || 0}</p>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={styles.blur}></div>
                </>
            )}

            {imgError && (
                <div className={styles.overlayError}>
                    <TbError404 />
                </div>
            )}
        </div>
    );
}

export default memo(Image);
