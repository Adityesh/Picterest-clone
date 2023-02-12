import { object, string, TypeOf } from "zod";

export const registerSchema = object({
    email: string().email(),
    name: string(),
    password: string().min(5).max(20),
});

export const loginSchema = object({
    email: string().email().optional(),
    name: string().optional(),
    password: string(),
});

export type UserRegisterInput = TypeOf<typeof registerSchema>;
export type UserLoginInput = TypeOf<typeof loginSchema>;
