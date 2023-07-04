import { TRPCError, inferAsyncReturnType, initTRPC } from "@trpc/server";
import { createContext } from "../context";

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 * Infer type of context
 */
export const t = initTRPC
  .context<inferAsyncReturnType<typeof createContext>>()
  .create();

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
// export const router = t.router;
// export const publicProcedure = t.procedure;

const isAdminMiddleware = t.middleware(({ ctx, next }) => {
  if (!ctx.isAdmin) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  const newContext = {
    user: { id: 1 },
  };
  return next({ ctx: newContext });
});

export const adminProcedure = t.procedure.use(isAdminMiddleware);
