import styles from "./Header.module.scss";
import { useSession, signIn, signOut } from "next-auth/react";
import dynamic from "next/dynamic";
import MenuNav from "./MenuNav";
import Button from "../ui/Button";

export default function Header() {
    const { data } = useSession();
    const isLoggedIn = data != null;

    return (
        <div className={styles.nav}>
            <div className={styles.left}>
                <p>Picterest</p>
            </div>
            <div className={styles.right}>
                {isLoggedIn ? (
                    <MenuNav />
                ) : (
                    <Button
                        variant="default"
                        value="Sign in"
                        onClick={() => void signIn("github")}
                        style={{
                            marginLeft: "5px",
                            display: "inline-block",
                        }}
                    />
                )}
            </div>
        </div>
    );
}
