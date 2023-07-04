import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import cors from "cors";
import express from "express";
import ws from "ws";
import { createContext } from "./context";
import { appRouter } from "./routers/index";

const app = express();

app.use(cors({ origin: "*" }));
app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);
const server = app.listen(3000);

applyWSSHandler({
  wss: new ws.Server({ server }),
  router: appRouter,
  createContext: () => {
    return { isAdmin: true };
  },
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
