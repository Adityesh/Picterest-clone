import { string, object, TypeOf, number } from 'zod'

export const addPinSchema = object({
    title : string().min(4).max(30),
    image : string().url({ message : "Invalid url"}),
    authorId : number()
})

type orderBy = "asc" | "desc"

export const getPinSchema = object({
    cursor : number().nonnegative().optional(),
    limit : number().nonnegative(),
})



export type AddPinInput = TypeOf<typeof addPinSchema>
export type GetPinInput = TypeOf<typeof getPinSchema>


