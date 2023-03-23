import { Progress } from "@mantine/core";
import { Pin } from "@prisma/client";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useFilterStore } from "~/store/filter";
import { api } from "~/utils/api";
import styles from "./PinGrid.module.scss";
const Image = dynamic(() => import("./Image").then((mod) => mod.default));

export default function PinGrid() {
    const { count, orderBy, titleFilter } = useFilterStore();
    const observerElem = useRef<HTMLDivElement>(null);
    const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
        api.pin.getPins.useInfiniteQuery(
            {
                titleFilter,
                count,
                orderBy,
            },
            {
                getNextPageParam: (lastPage) => {
                    return lastPage.nextCursor;
                },
                staleTime: 5 * 60 * 1000,
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
            </div>
        </div>
    );
}
