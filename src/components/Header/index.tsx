import styles from "./Header.module.scss";
import { useSession, signIn, signOut } from "next-auth/react";
import Button from "../ui/Button";


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
                    <Button
                        variant="secondary"
                        onClick={() => void signOut()}
                        value="Log out"
                    />
                ) : (
                    <>
                        <Button
                            value="Log in"
                            variant="primary"
                            onClick={() => void signIn("github")}
                        />

                        <Button
                            variant="default"
                            value="Register"
                            onClick={() => void signIn("github")}
                            style={{ marginLeft: "5px", display : "inline-block" }}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
