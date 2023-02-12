import { create } from "zustand";

export type MenuStage = "register" | "login" | "profile"

interface DrawerInterface {
    open: boolean;
    toggleDrawer: () => void;
    closeDrawer: () => void;
    openDrawer: () => void;
    menuStage : MenuStage;
    setMenuStage : (stage : MenuStage) => void;
}

export const createDrawerStore = create<DrawerInterface>((set) => ({
    open: false,
    toggleDrawer: () => set((state) => ({ open: !state.open })),
    closeDrawer: () => set(() => ({ open: false })),
    openDrawer: () => set(() => ({ open: true })),
    menuStage : "register",
    setMenuStage : (stage : MenuStage) => set(() => ({ menuStage : stage}))
}));
