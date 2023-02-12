import { Pin } from "../prisma";
import { procedure, router } from "../trpc";

export const pinRouter = router({
    getPinsPublic: procedure
        // .input(null)
        .query(async () => {
            const result = await Pin.findMany();
            return result;
        }),
});
