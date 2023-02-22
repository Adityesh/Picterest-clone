import styles from "./Search.module.scss";
import { Input, Kbd, ActionIcon, Button } from "@mantine/core";
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
            <Input
                placeholder="Search for pins"
                rightSection={
                    <Kbd>
                        <GrReturn />
                    </Kbd>
                }
                className={styles.searchContainer}
            />
            {isLoggedIn && (
                <Button
                    color="green"
                    onClick={() => handleModal(true)}
                    className={styles.addBtn}
                    leftIcon={<BiImageAdd className={styles.iconStyle} />}
                >
                    Add
                </Button>
            )}
        </div>
    );
}
