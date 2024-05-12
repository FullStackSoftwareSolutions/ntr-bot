import { createTRPCRouter, publicProcedure } from "@next/server/api/trpc";
import { getAllSkatesHandler } from "./skates.controller";

export const skatesRouter = createTRPCRouter({
  getAll: publicProcedure.query(() => getAllSkatesHandler()),
});
