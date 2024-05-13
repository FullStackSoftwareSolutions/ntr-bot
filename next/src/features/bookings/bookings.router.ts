import { createTRPCRouter, protectedProcedure } from "@next/server/api/trpc";
import {
  getAllBookingsHandler,
  getAllFutureBookingsHandler,
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
  getAll: protectedProcedure.query(() => getAllBookingsHandler()),
  getAllFuture: protectedProcedure.query(() => getAllFutureBookingsHandler()),
});
