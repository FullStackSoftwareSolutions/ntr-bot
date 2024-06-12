import { createTRPCRouter, protectedProcedure } from "@next/server/api/trpc";
import {
  deleteUserHandler,
  getAllUsersHandler,
  getUserByIdHandler,
  updateUserHandler,
} from "./users.controller";
import { z } from "zod";

export const usersRouter = createTRPCRouter({
  getById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(({ input: { id } }) => getUserByIdHandler(id)),
  getAll: protectedProcedure.query(() => getAllUsersHandler()),
  deleteOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(({ input: { id } }) => deleteUserHandler(id)),
  updateOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        admin: z.boolean(),
        playerId: z.number().nullable(),
      }),
    )
    .mutation(({ input: { id, playerId, admin } }) =>
      updateUserHandler(id, { playerId, admin }),
    ),
});
