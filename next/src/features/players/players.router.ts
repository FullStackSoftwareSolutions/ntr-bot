import { createTRPCRouter, protectedProcedure } from "@next/server/api/trpc";
import {
  canUseEmailHandler,
  createPlayerHandler,
  deletePlayerHandler,
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
        playerId: z.number().optional(),
      }),
    )
    .query(({ input: { email, playerId } }) =>
      canUseEmailHandler({ email, playerId }),
    ),
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
  updateOne: protectedProcedure
    .input(
      z.object({
        playerId: z.number(),
        email: z.string().optional().nullable(),
        fullName: z.string().optional(),
        nickname: z.string().optional().nullable(),
        phoneNumber: z.string().optional().nullable(),
        skillLevel: z.number().nullable().optional(),
        isPlayer: z.boolean().optional(),
        isGoalie: z.boolean().optional(),
        notes: z.string().optional().nullable(),
      }),
    )
    .mutation(
      ({
        input: {
          playerId,
          email,
          fullName,
          nickname,
          phoneNumber,
          skillLevel,
          isPlayer,
          isGoalie,
          notes,
        },
      }) =>
        updatePlayerHandler(playerId, {
          email,
          fullName,
          nickname,
          phoneNumber,
          skillLevel,
          isPlayer,
          isGoalie,
          notes,
        }),
    ),
  deleteOne: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(({ input: { id } }) => deletePlayerHandler(id)),
});
