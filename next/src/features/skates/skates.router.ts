import { createTRPCRouter, publicProcedure } from "@next/server/api/trpc";
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
  getAll: publicProcedure.query(() => getAllSkatesHandler()),
  getFuture: publicProcedure.query(() => getFutureSkatesHandler()),
  getAllForBooking: publicProcedure
    .input(z.object({ bookingId: z.number() }))
    .query(({ input: { bookingId } }) =>
      getAllSkatesForBookingHandler({ bookingId }),
    ),
  getAllFutureForBooking: publicProcedure
    .input(z.object({ bookingId: z.number() }))
    .query(({ input: { bookingId } }) =>
      getAllFutureSkatesForBookingHandler({ bookingId }),
    ),
  getBySlugs: publicProcedure
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
  announce: publicProcedure
    .input(
      z.object({
        skateId: z.number(),
      }),
    )
    .mutation(({ input: { skateId } }) => announceSkateHandler({ skateId })),
});
