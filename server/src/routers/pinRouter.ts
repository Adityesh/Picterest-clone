import { addPinSchema, getPinSchema } from "../schema/pin.schema";
import { addPin, getPins } from "../services/pin";
import { privateProcedure, procedure, router } from "../trpc";

export const pinRouter = router({
    addPin : procedure.input(addPinSchema).mutation(addPin),
    getPins : procedure.input(getPinSchema).mutation(getPins)
});
