import { router, t } from "../trpc";
import { pinRouter } from "./pinRouter";
import { userRouter } from "./userRouter";

export const appRouter = router({
    user: userRouter,
    pin: pinRouter,
});
