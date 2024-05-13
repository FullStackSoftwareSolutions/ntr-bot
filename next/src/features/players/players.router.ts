import { createTRPCRouter, publicProcedure } from "@next/server/api/trpc";
import {
  getAllPlayersHandler,
  getPlayerByEmailHandler,
} from "./players.controller";
import { z } from "zod";

export const playersRouter = createTRPCRouter({
  getAll: publicProcedure.query(() => getAllPlayersHandler()),
  getByEmail: publicProcedure
    .input(
      z.object({
        email: z.string(),
      }),
    )
    .query(({ input: { email } }) => getPlayerByEmailHandler({ email })),
});
