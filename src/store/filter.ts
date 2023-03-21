import { create } from "zustand";
import type { GetPinType as BaseType } from "../schema/pin";

type GetPinType = Omit<BaseType, "cursor"> & {
    updateCount: (value: number) => void;
    updateOrder: (
        field: "title" | "createdAt" | "updatedAt",
        ordering: "asc" | "desc"
    ) => void;
    updateFilterTitle: (title: string) => void;
};

export const useFilterStore = create<GetPinType>((set) => ({
    titleFilter: "",
    orderBy: {
        field: "title",
        ordering: "asc",
    },
    count: 5,
    updateCount: (value: number) => set(() => ({ count: value })),
    updateOrder: (
        field: "title" | "createdAt" | "updatedAt" = "title",
        ordering: "asc" | "desc" = "asc"
    ) =>
        set(() => ({
            orderBy: {
                field,
                ordering,
            },
        })),
    updateFilterTitle: (title: string) => set(() => ({ titleFilter: title })),
}));
