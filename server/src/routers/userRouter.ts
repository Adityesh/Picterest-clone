import { router, procedure } from "../trpc";
import { loginUser, registerUser } from "../services/user";
import { loginSchema, registerSchema } from "../schema/user.schema";

export const userRouter = router({
    registerUser: procedure.input(registerSchema).mutation(registerUser),
    loginUser: procedure.input(loginSchema).mutation(loginUser),
});
