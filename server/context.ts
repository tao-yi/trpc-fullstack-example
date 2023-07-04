import { CreateExpressContextOptions } from "@trpc/server/adapters/express";

export function createContext({ req, res }: CreateExpressContextOptions) {
  console.log(req, res);
  return {
    isAdmin: true,
    // req,
    // res,
  };
}
