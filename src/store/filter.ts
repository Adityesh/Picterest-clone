import { create } from "zustand";
import type { GetPinType as BaseType } from "../schema/pin";

type GetPinType = Omit<BaseType, "cursor"> & {
    updateCount: (value: number) => void;
    updateOrder: (
        field: "title" | "createdAt" | "updatedAt" | "id",
        ordering: "asc" | "desc"
    ) => void;
    updateFilterTitle: (title: string) => void;
};

export const useFilterStore = create<GetPinType>((set) => ({
    titleFilter: "",
    orderBy: {
        field: "createdAt",
        ordering: "desc",
    },
    count: 10,
    updateCount: (value: number) => set(() => ({ count: value })),
    updateOrder: (
        field: "title" | "createdAt" | "updatedAt" | "id" = "createdAt",
        ordering: "asc" | "desc" = "desc"
    ) =>
        set(() => ({
            orderBy: {
                field,
                ordering,
            },
        })),
    updateFilterTitle: (title: string) => set(() => ({ titleFilter: title })),
}));
