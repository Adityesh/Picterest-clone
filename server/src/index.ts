import express, { Express } from 'express';
import dotenv from 'dotenv';
import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter } from './trpc';


dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router : appRouter,
  })
)

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});