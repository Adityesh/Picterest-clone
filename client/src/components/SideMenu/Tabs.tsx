import { Tabs } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { HiLogin, HiUserAdd } from 'react-icons/hi'
import { createDrawerStore, MenuStage } from "../../store/menu";
import RegisterForm from "./RegisterForm";

export default function SideMenuTabs() {
    const { menuStage, setMenuStage } = createDrawerStore();
    return (
        <Tabs defaultValue={menuStage} value={menuStage} onTabChange={tab => setMenuStage(tab as MenuStage)}>
            <Tabs.List>
                <Tabs.Tab value={"register" as MenuStage} icon={<HiUserAdd size={14} />}>Registration</Tabs.Tab>
                <Tabs.Tab value={"login" as MenuStage} icon={<HiLogin size={14} />}>Login</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value={"register" as MenuStage} pt="xs">
                <RegisterForm />
            </Tabs.Panel>

            <Tabs.Panel value={"login" as MenuStage} pt="xs">
                <button onClick={() => showNotification({
                    message : "sdfsdfsdf",
                    color : "red",
                    
                })}>asdasdasd</button>
            </Tabs.Panel>
        </Tabs>
    )
}