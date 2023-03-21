import { useState, useCallback } from "react";
import styles from "./Search.module.scss";
import { ChangeEvent } from "react";
import { debounce } from "~/utils/functions";
import { useFilterStore } from "~/store/filter";

export default function Search() {
    const [titleInput, setTitleInput] = useState("");
    const { updateFilterTitle, titleFilter } = useFilterStore();

    const debouncedTitleFilter = useCallback(
        debounce((value) => updateFilterTitle(value), 1000),
        [titleFilter]
    );

    const handleSearchInput = (
        e: ChangeEvent<HTMLInputElement> | undefined
    ) => {
        const value = e?.target.value;
        setTitleInput(value || "");
        debouncedTitleFilter(value || "");
    };

    return (
        <div className={styles.container}>
            <input
                type="text"
                value={titleInput}
                placeholder="Search"
                className={styles.searchInput}
                onChange={handleSearchInput}
            />
        </div>
    );
}
