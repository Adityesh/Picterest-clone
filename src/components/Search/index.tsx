import styles from './Search.module.scss'
import { Input, Kbd, ActionIcon, Button } from '@mantine/core'
import { GrReturn } from 'react-icons/gr'
import { BiImageAdd } from 'react-icons/bi'
import { useModalStore } from '~/store/modal'

export default function Search() {
    const { open, type, handleModal } = useModalStore(state => state)
    return (
        <div className={styles.container}>
            <Input placeholder='Search for pins' rightSection={
                <Kbd ><GrReturn /></Kbd>
            } className={styles.searchContainer} />
            <Button onClick={() => handleModal(true)} className={styles.addBtn} variant="outline" leftIcon={<BiImageAdd size="1.5em"/>}>Add</Button>
        </div>
    )
}