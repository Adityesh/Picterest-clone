import * as trpcExpress from "@trpc/server/adapters/express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import { appRouter } from "./routers";
import { createContext } from "./trpc/context";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(
    "/trpc",
    trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext: createContext,
    })
);

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at PORT ${port}`);
});
