import styles from "./Search.module.scss";
import { GrReturn } from "react-icons/gr";
import { BiImageAdd } from "react-icons/bi";
import { useModalStore } from "~/store/modal";
import { useSession } from "next-auth/react";

export default function Search() {
    const { handleModal } = useModalStore((state) => state);
    const { data: sessionData } = useSession();
    const isLoggedIn = sessionData !== null;

    return (
        <div className={styles.container}>
            <input
                type="text"
                placeholder="Search"
                className={styles.searchInput}
            />
            {isLoggedIn && (
                <button
                    className={styles.addBtn}
                    onClick={() => handleModal(true)}
                >
                    Add
                </button>
            )}
        </div>
    );
}
