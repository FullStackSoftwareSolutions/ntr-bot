import { createTRPCRouter, publicProcedure } from "@next/server/api/trpc";
import {
  getAllBookingsHandler,
  getAllFutureBookingsHandler,
  getBookingBySlugHandler,
} from "./bookings.controller";
import { z } from "zod";

export const bookingsRouter = createTRPCRouter({
  getBySlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(({ input }) => {
      return getBookingBySlugHandler(input.slug);
    }),
  getAll: publicProcedure.query(() => getAllBookingsHandler()),
  getAllFuture: publicProcedure.query(() => getAllFutureBookingsHandler()),
});
