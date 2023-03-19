import { api } from "~/utils/api";
import styles from "./PinGrid.module.scss";
import { useMemo, useEffect, useCallback, useRef } from "react";
import { Pin } from "@prisma/client";
import { Image } from "./Image";
import { Divider, Loader, Progress } from "@mantine/core";

export default function PinGrid() {
    const observerElem = useRef<HTMLDivElement>(null);
    const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
        api.pin.getPins.useInfiniteQuery(
            {
                count: 5,
                orderBy: {
                    field: "createdAt",
                    ordering: "asc",
                },
            },
            {
                getNextPageParam: (lastPage) => {
                    return lastPage.nextCursor;
                },
            }
        );

    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const [target] = entries;
            if (target?.isIntersecting) {
                fetchNextPage();
            }
        },
        [fetchNextPage, hasNextPage]
    );

    const paginatedData = useMemo(() => {
        let result: Pin[] = [];
        data &&
            data.pages.forEach((value) => {
                result = [...result, ...value.items];
            });
        return result;
    }, [data]);

    useEffect(() => {
        const element = observerElem.current;
        const option = { threshold: 0.5 };

        const observer = new IntersectionObserver(handleObserver, option);
        observer.observe(element!);
        return () => observer.unobserve(element!);
    }, [fetchNextPage, hasNextPage, handleObserver]);

    return (
        <div className={styles.PinGrid}>
            <div className={styles.gridContainer}>
                {paginatedData?.map((pin) => {
                    return <Image {...pin} />;
                })}
            </div>
            <div className="loader" ref={observerElem}>
                {isFetchingNextPage &&
                    hasNextPage &&
                    paginatedData.length > 0 && (
                        <Progress value={100} animate />
                    )}
                <Divider sx={{ margin: "1rem auto", width : "95%" }} />
            </div>
        </div>
    );
}
