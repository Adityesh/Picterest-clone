import { TRPCError } from "@trpc/server";
import { User, Pin } from "../prisma";
import { AddPinInput, GetPinInput } from "../schema/pin.schema";
import type { Context } from "../trpc/context";


export const addPin = async ({ ctx, input} : { ctx : Context, input : AddPinInput }) => {
    const userExists = await User.findUnique({
        where : {
            id : input.authorId
        }
    });

    if(!userExists) {
        throw new TRPCError({
            code : "BAD_REQUEST",
            message : "User does not exist"
        })
    }

    const newPin = await Pin.create({
        data : {
            image : input.image,
            authorId : input.authorId,
            title : input.title,
        }
    });

    return newPin;
}

export const getPins = async ( { ctx, input } : { ctx : Context, input : GetPinInput }) => {
    const { cursor, limit } = input
    let cursorQuery = {
    } as {
        gt : number | undefined
    }
    if(cursor) {
        cursorQuery.gt = cursor
    }
    const pins = await Pin.findMany({
       where : {
            id : cursorQuery,
       },
       take : limit
    })

    return {
        pins,
        cursor : pins.at(-1)?.id
    }

}