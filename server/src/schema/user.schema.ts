import { object, string, TypeOf, optional } from "zod";

export const registerSchema = object({
    email: string().email(),
    name: string(),
    password: string().min(5).max(20),
});

export const loginSchema = object({
    email: optional(string().email()),
    name: optional(string()),
    password: string(),
});

export type UserRegisterInput = TypeOf<typeof registerSchema>;
export type UserLoginInput = TypeOf<typeof loginSchema>;
