import { createTRPCRouter, protectedProcedure } from "@next/server/api/trpc";
import { logoutHandler } from "./auth.controller";

export const authRouter = createTRPCRouter({
  logout: protectedProcedure.mutation(() => logoutHandler()),
});
