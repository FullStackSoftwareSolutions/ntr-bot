import { createTRPCRouter, protectedProcedure } from "@next/server/api/trpc";
import {
  announceSpotsSkateHandler,
  getAllFutureSkatesForBookingHandler,
  getAllSkatesForBookingHandler,
  getAllSkatesHandler,
  getFutureSkatesHandler,
  getSkateBySlugsHandler,
  skateDropOutPlayerHandler,
} from "./skates.controller";
import { z } from "zod";
import { type Positions } from "./skates.model";

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
  dropOutPlayer: protectedProcedure
    .input(
      z.object({
        skateId: z.number(),
        playerId: z.number(),
        position: z.string(),
      }),
    )
    .mutation(({ input: { skateId, playerId, position } }) =>
      skateDropOutPlayerHandler({
        skateId,
        playerId,
        position: position as Positions,
      }),
    ),
  announceSpots: protectedProcedure
    .input(
      z.object({
        skateId: z.number(),
      }),
    )
    .mutation(({ input: { skateId } }) =>
      announceSpotsSkateHandler({ skateId }),
    ),
});
