import styles from './Header.module.scss';
import { Button } from '@mantine/core'
import { useSession, signIn, signOut } from 'next-auth/react';
export default function Header() {
    const { data : sessionData } = useSession()
    const isLoggedIn = sessionData?.user;


    return (
        <div className={styles.nav}>
        <div className={styles.left}>
          <p>Picterest</p>
        </div>
        <div className={styles.right}>
          {isLoggedIn ? <Button onClick={() => void signOut()}>Log out</Button> : <>
          <Button onClick={() => void signIn()}>Login</Button>
          </>}
        </div>
      </div>
    )
}