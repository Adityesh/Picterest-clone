import express, { Express } from 'express';
import dotenv from 'dotenv';
import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter } from './routers';
import { SessionConfig } from './db';
import session from 'express-session';
import { createContext } from './trpc/context';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(session(SessionConfig))

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router : appRouter,
    createContext : createContext
  })
)

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at PORT ${port}`);
});