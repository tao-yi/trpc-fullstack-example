import { adminProcedure, t } from "./trpc";
import { userRouter } from "./users";

export const appRouter = t.router({
  sayHi: t.procedure.query(() => {
    return "hi";
  }),
  logToServer: t.procedure
    .input((v) => {
      if (typeof v === "string") return v;
      throw new Error("Invalid input: Expected string");
    })
    .mutation((req) => {
      console.log(`Client says: ${req.input}`);
      return true;
    }),
  users: userRouter,
  secretData: adminProcedure.query(({ ctx }) => {
    console.log(ctx.user);
    return "secret data";
  }),
});

// export const mergedRouter = t.mergeRouters(appRouter, userRouter);
