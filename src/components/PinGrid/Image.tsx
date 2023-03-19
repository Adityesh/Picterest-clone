import { useRef, useEffect } from "react";
import { type Pin } from "@prisma/client";
import { api } from "~/utils/api";
import {
    AiFillHeart,
    AiOutlineHeart,
    AiOutlineFieldTime,
} from "react-icons/ai";
import styles from "./PinGrid.module.scss";

export function Image(props: Pin) {
    const overlayRef = useRef<HTMLDivElement>(null);



    const {
        refetch: fetchPin,
        isLoading,
        data,
    } = api.pin.getPinInDetail.useQuery(
        {
            pinId: props.id,
        },
        { enabled: false, staleTime: 1000 * 60 * 10 }
    );

    const handleFetchData = () => {
        fetchPin();
    };

    return (
        <div className={styles.imageContainer} onMouseEnter={handleFetchData}>
            <img
                src={props.image}
                className={styles.pinImage}
                loading="lazy"
                decoding="async"
            />

            <div className={styles.overlay} ref={overlayRef}>
                <div className={styles.overlayContent}>
                    <p className={styles.overlayTitle}>{data?.title}</p>
                    <div>
                        <img src={data?.author.image || ""} loading="lazy" />
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
        </div>
    );
}
