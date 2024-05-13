import { createTRPCRouter, protectedProcedure } from "@next/server/api/trpc";
import {
  announceSkateHandler,
  getAllFutureSkatesForBookingHandler,
  getAllSkatesForBookingHandler,
  getAllSkatesHandler,
  getFutureSkatesHandler,
  getSkateBySlugsHandler,
} from "./skates.controller";
import { z } from "zod";

export const skatesRouter = createTRPCRouter({
  getAll: protectedProcedure.query(() => getAllSkatesHandler()),
  getFuture: protectedProcedure.query(() => getFutureSkatesHandler()),
  getAllForBooking: protectedProcedure
    .input(z.object({ bookingId: z.number() }))
    .query(({ input: { bookingId } }) =>
      getAllSkatesForBookingHandler({ bookingId }),
    ),
  getAllFutureForBooking: protectedProcedure
    .input(z.object({ bookingId: z.number() }))
    .query(({ input: { bookingId } }) =>
      getAllFutureSkatesForBookingHandler({ bookingId }),
    ),
  getBySlugs: protectedProcedure
    .input(
      z.object({
        bookingSlug: z.string(),
        skateSlug: z.string(),
      }),
    )
    .query(({ input: { bookingSlug, skateSlug } }) =>
      getSkateBySlugsHandler({
        bookingSlug,
        skateSlug,
      }),
    ),
  announce: protectedProcedure
    .input(
      z.object({
        skateId: z.number(),
      }),
    )
    .mutation(({ input: { skateId } }) => announceSkateHandler({ skateId })),
});
