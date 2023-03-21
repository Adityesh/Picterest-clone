import { create } from "zustand";

type ModalStore = {
    open : boolean,
    type : "add" | "update",
    handleModal: (toggle: boolean) => void
}

export const useModalStore = create<ModalStore>((set) => ({
    open : false,
    type : "add",
    handleModal : (toggle : boolean) => set((state) => ({ open : toggle }))
})) 