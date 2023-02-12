import { object, string, TypeOf, optional } from "zod";

export const registerSchema = object({
    email: string().email({ message : "Invalid email"}),
    name: string(),
    password: string().min(5, { message : "Password must be min 5 characters"}).max(20),
});

export const loginSchema = object({
    email: optional(string().email()),
    name: optional(string()),
    password: string(),
});

export type UserRegisterInput = TypeOf<typeof registerSchema>;
export type UserLoginInput = TypeOf<typeof loginSchema>;
