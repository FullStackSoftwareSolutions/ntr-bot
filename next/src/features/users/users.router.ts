import { createTRPCRouter, protectedProcedure } from "@next/server/api/trpc";
import { deleteUserHandler, getAllUsersHandler } from "./users.controller";
import { z } from "zod";

export const usersRouter = createTRPCRouter({
  getAll: protectedProcedure.query(() => getAllUsersHandler()),
  deleteOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(({ input: { id } }) => deleteUserHandler(id)),
});
