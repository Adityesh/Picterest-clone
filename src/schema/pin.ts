import { z } from "zod";

export const GetPinSchema = z.object({
    orderBy: z
        .object({
            field: z.enum(["title", "createdAt", "updatedAt", "id"]),
            ordering: z.enum(["asc", "desc"]),
        })
        .optional(),
    cursor: z.string().nullish(),
    count: z.number(),
    titleFilter: z.string().optional(),
});

export type GetPinType = z.TypeOf<typeof GetPinSchema>;

export const AddPinSchema = z.object({
    title: z.string(),
    image: z.string().url({ message: "Image must be a url" }),
});

export type AddPinType = z.TypeOf<typeof AddPinSchema>;

export const RemovePinSchema = z.object({
    pinId: z.string(),
});

export type RemovePinType = z.TypeOf<typeof RemovePinSchema>;

export const UpdatePinSchema = z.object({
    pinId: z.string(),
    title: z.string().optional(),
    image: z.string().url({ message: "Invalid url" }).optional(),
});

export type UpdatePinType = z.TypeOf<typeof UpdatePinSchema>;

export const GetPinInDetailSchema = z.object({
    pinId: z.string(),
})

export type GetPinInDetailType = z.TypeOf<typeof GetPinInDetailSchema>;