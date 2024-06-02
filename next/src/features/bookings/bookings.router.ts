import { createTRPCRouter, protectedProcedure } from "@next/server/api/trpc";
import {
  getAllBookingsHandler,
  getBookingBySlugHandler,
} from "./bookings.controller";
import { z } from "zod";

export const bookingsRouter = createTRPCRouter({
  getBySlug: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(({ input }) => {
      return getBookingBySlugHandler(input.slug);
    }),
  getAll: protectedProcedure
    .input(
      z.object({
        type: z.union([
          z.literal("future"),
          z.literal("past"),
          z.literal("all"),
        ]),
      }),
    )
    .query(({ input: { type } }) =>
      getAllBookingsHandler({
        type,
      }),
    ),
});
