import { Drawer } from "@mantine/core"
import { createDrawerStore } from "../../store/menu"
import RegisterForm from "./RegisterForm"
import SideMenuTabs from "./Tabs"

export default function SideMenu() {
    const { open, closeDrawer } = createDrawerStore()
    
    return (
        <Drawer onClose={closeDrawer} opened={open} title={"Hi"}
            padding="xl"
            size="xl"
            >
            <SideMenuTabs />
        </Drawer>
    )
}