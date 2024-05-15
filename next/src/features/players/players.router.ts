import { createTRPCRouter, protectedProcedure } from "@next/server/api/trpc";
import {
  getAllPlayersHandler,
  getPlayerByEmailHandler,
  updatePlayerHandler,
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
  update: protectedProcedure
    .input(
      z.object({
        playerId: z.number(),
        updates: z.object({
          email: z.string().optional(),
          fullName: z.string().optional(),
          nickname: z.string().optional(),
          phoneNumber: z.string().optional(),
          skillLevel: z.number().nullable().optional(),
          isPlayer: z.boolean().optional(),
          isGoalie: z.boolean().optional(),
          notes: z.string().optional(),
        }),
      }),
    )
    .mutation(({ input: { playerId, updates } }) =>
      updatePlayerHandler(playerId, updates),
    ),
});
