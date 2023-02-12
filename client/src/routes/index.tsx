import { Outlet } from "react-router-dom";
import { ActionIcon } from "@mantine/core";
import { HiMenuAlt2 } from 'react-icons/hi'
import { createDrawerStore } from '../store/menu'
import SideMenu from "../components/SideMenu";

export default function Index() {
    const { openDrawer } = createDrawerStore((state) => state)
    
    return <>
        <ActionIcon sx={{ margin: "1em" }} onClick={openDrawer}>
            <HiMenuAlt2 size={24} />
        </ActionIcon>
        <SideMenu />
        <Outlet />

    </>
}