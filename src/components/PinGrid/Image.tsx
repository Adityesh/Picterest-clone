import { useRef, useState, useEffect } from "react";
import { type Pin } from "@prisma/client";
import { api } from "~/utils/api";
import {
    AiFillHeart,
    AiOutlineHeart,
    AiOutlineFieldTime,
} from "react-icons/ai";
import styles from "./PinGrid.module.scss";
import { Skeleton } from "@mantine/core";

export function Image(props: Pin) {
    const [imgLoading, setImgLoading] = useState(true);
    const overlayRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    const { refetch: fetchPin, data } = api.pin.getPinInDetail.useQuery(
        {
            pinId: props.id,
        },
        { enabled: false, staleTime: 1000 * 60 * 10, cacheTime: 5 * 60 * 1000 }
    );

    const handleFetchData = () => {
        fetchPin();
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
                    ref={imgRef}
                    src={props.image}
                    className={styles.pinImage}
                    loading="lazy"
                    decoding="async"
                    onLoad={() => setImgLoading(false)}
                />
            </Skeleton>

            {!imgLoading && (
                <>
                    <div className={styles.overlay} ref={overlayRef}>
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
                                <div>
                                    <AiOutlineHeart fontSize={"1.5rem"} />
                                    <p>{data?.likes.length || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.blur}></div>
                </>
            )}
        </div>
    );
}
