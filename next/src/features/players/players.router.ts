import { createTRPCRouter, protectedProcedure } from "@next/server/api/trpc";
import {
  getAllPlayersHandler,
  getPlayerByEmailHandler,
} from "./players.controller";
import { z } from "zod";

export const playersRouter = createTRPCRouter({
  getAll: protectedProcedure.query(() => getAllPlayersHandler()),
  getByEmail: protectedProcedure
    .input(
      z.object({
        email: z.string(),
      }),
    )
    .query(({ input: { email } }) => getPlayerByEmailHandler({ email })),
});
