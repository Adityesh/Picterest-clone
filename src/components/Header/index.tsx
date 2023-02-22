import styles from "./Header.module.scss";
import { Button } from "@mantine/core";
import { useSession, signIn, signOut } from "next-auth/react";
import {
    RiLoginCircleLine,
    RiLogoutCircleLine,
    RiGithubLine,
} from "react-icons/ri";
export default function Header() {
    const { data: sessionData } = useSession();
    const isLoggedIn = sessionData?.user;

    return (
        <div className={styles.nav}>
            <div className={styles.left}>
                <p>Picterest</p>
            </div>
            <div className={styles.right}>
                {isLoggedIn ? (
                    <Button className={styles.btn} onClick={() => void signOut()} color="red">
                        Log out{" "}
                        <RiLogoutCircleLine className={styles.iconStyle} />
                    </Button>
                ) : (
                    <>
                        <Button className={styles.btn} onClick={() => void signIn("github")} color="green">
                            Login{" "}
                            <RiLoginCircleLine className={styles.iconStyle} />
                        </Button>
                        <Button className={styles.btn} onClick={() => void signIn("github")} sx={{marginLeft : "5px"}}>
                            Register <RiGithubLine className={styles.iconStyle} />
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
