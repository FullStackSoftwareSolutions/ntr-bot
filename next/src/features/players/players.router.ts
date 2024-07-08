import { createTRPCRouter, protectedProcedure } from "@next/server/api/trpc";
import {
  canUseEmailHandler,
  createPlayerHandler,
  getAllPlayersHandler,
  getPlayerByEmailHandler,
  getPlayerByIdHandler,
  getPlayerByPhoneNumberHandler,
  updatePlayerHandler,
} from "./players.controller";
import { z } from "zod";

export const playersRouter = createTRPCRouter({
  getAll: protectedProcedure.query(() => getAllPlayersHandler()),
  getById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(({ input: { id } }) => getPlayerByIdHandler({ id })),
  getByEmail: protectedProcedure
    .input(
      z.object({
        email: z.string(),
      }),
    )
    .query(({ input: { email } }) => getPlayerByEmailHandler({ email })),
  getByPhoneNumber: protectedProcedure
    .input(
      z.object({
        phoneNumber: z.string(),
      }),
    )
    .query(({ input: { phoneNumber } }) =>
      getPlayerByPhoneNumberHandler({ phoneNumber }),
    ),
  canUseEmail: protectedProcedure
    .input(
      z.object({
        email: z.string(),
      }),
    )
    .query(({ input: { email } }) => canUseEmailHandler({ email })),
  create: protectedProcedure
    .input(
      z.object({
        fullName: z.string(),
        nickName: z.string().optional(),
        email: z.string().email().nullable(),
        phoneNumber: z.string(),
        skillLevel: z.number().positive(),
        isPlayer: z.boolean(),
        isGoalie: z.boolean(),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) => createPlayerHandler(input)),
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
