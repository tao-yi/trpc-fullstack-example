import { observable } from "@trpc/server/observable";
import { EventEmitter } from "events";
import { z } from "zod";
import { t } from "./trpc";

const userProcedure = t.procedure.input(
  z.object({
    userId: z.string(),
  }),
);

const eventEmitter = new EventEmitter();

export const userRouter = t.router({
  get: userProcedure.query(({ input }) => {
    return { id: input.userId, name: "Kyle" };
  }),
  update: userProcedure
    .input(z.object({ name: z.string() }))
    .output(
      // specify output format
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    )
    .mutation(({ input, ctx }) => {
      console.log(ctx.isAdmin);
      console.log(
        `updating user ${input.userId} to have the name ${input.name}`,
      );

      eventEmitter.emit("update", input.userId);
      return {
        id: input.userId,
        name: input.name,
        password: "xasda",
      };
    }),
  onUpdate: t.procedure.subscription(() => {
    return observable<string>((emit) => {
      // listen to update event
      eventEmitter.on("update", (userId) => emit.next(userId));

      // when connection is closed, return
      return () => {
        eventEmitter.off("update", emit.next);
      };
    });
  }),
});
