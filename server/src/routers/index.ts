import { router } from "../trpc";
import { userRouter } from "./userRouter";

export const appRouter = router({
    user : userRouter
})
