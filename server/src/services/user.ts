import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../prisma";
import { UserLoginInput, UserRegisterInput } from "../schema/user.schema";
import type { Context } from "../trpc/context";

export const registerUser = async ({
    ctx,
    input,
}: {
    ctx: Context;
    input: UserRegisterInput;
}) => {
    const { email, name, password } = input;
    const SALT_ROUNDS = 10;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return await User.create({
        data: {
            email,
            name,
            password: hashedPassword,
        },
        select: {
            email: true,
            createdAt: true,
            id: true,
            name: true,
            updatedAt: true,
        },
    });
};

export const loginUser = async ({
    ctx,
    input,
}: {
    ctx: Context;
    input: UserLoginInput;
}) => {
    const { email, name, password } = input;
    const { req, res } = ctx;

    if (!email && !name)
        throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Email or Name wasn't provided",
        });

    let query: any = {};

    if (email) query.email = email;

    if (name) query.name = name;

    const doesUserExist = await User.findUniqueOrThrow({
        where: query,
    });

    const isPasswordValid = await bcrypt.compare(
        password,
        doesUserExist.password
    );

    if (!isPasswordValid) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid credentials",
        });
    }

    const token = jwt.sign(
        {
            email: doesUserExist.email,
            id: doesUserExist.id,
            name: doesUserExist.name,
        },
        process.env.TOKEN_SECRET as string,
        {
            expiresIn: "2h",
        }
    );

    res.cookie("token", token, {
        maxAge: 1000 * 60 * 60 * 2,
    });

    return {
        email: doesUserExist.email,
        id: doesUserExist.id,
        name: doesUserExist.name,
    };
};
