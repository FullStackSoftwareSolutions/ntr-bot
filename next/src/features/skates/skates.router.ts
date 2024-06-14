import { createTRPCRouter, protectedProcedure } from "@next/server/api/trpc";
import {
  announceSpotsSkateHandler,
  announceTeamsSkateHandler,
  getAllSkatesForBookingHandler,
  getAllSkatesHandler,
  getFutureSkatesHandler,
  getSkateAvailableSubsHandler,
  getSkateBySlugsHandler,
  shuffleTeamsSkateHandler,
  skateDeleteSpotHandler,
  skateDropOutPlayerHandler,
  skateSubInPlayerHandler,
  skateUpdateSpotHandler,
} from "./skates.controller";
import { z } from "zod";
import { Positions } from "@db/features/skates/skates.type";

export const skatesRouter = createTRPCRouter({
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
    .query(({ input: { type } }) => getAllSkatesHandler({ type })),
  getFuture: protectedProcedure.query(() => getFutureSkatesHandler()),
  getAllForBooking: protectedProcedure
    .input(
      z.object({
        bookingId: z.number(),
        type: z.union([
          z.literal("future"),
          z.literal("past"),
          z.literal("all"),
        ]),
      }),
    )
    .query(({ input: { bookingId, type } }) =>
      getAllSkatesForBookingHandler({ bookingId, type }),
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
  getAvailableSubs: protectedProcedure
    .input(
      z.object({
        skateId: z.number(),
        position: z.nativeEnum(Positions),
      }),
    )
    .query(({ input: { skateId, position } }) =>
      getSkateAvailableSubsHandler({
        skateId,
        position,
      }),
    ),
  subInPlayer: protectedProcedure
    .input(
      z.object({
        skateId: z.number(),
        playerId: z.number(),
        position: z.string(),
      }),
    )
    .mutation(({ input: { skateId, playerId, position } }) =>
      skateSubInPlayerHandler({
        skateId,
        playerId,
        position: position as Positions,
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
  updateSpot: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        paid: z.boolean(),
      }),
    )
    .mutation(({ input: { id, paid } }) =>
      skateUpdateSpotHandler({
        id,
        paid,
      }),
    ),
  deleteSpot: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input: { id } }) => skateDeleteSpotHandler({ id })),
  shuffleTeams: protectedProcedure
    .input(
      z.object({
        skateId: z.number(),
      }),
    )
    .mutation(({ input: { skateId } }) =>
      shuffleTeamsSkateHandler({ skateId }),
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
  announceTeams: protectedProcedure
    .input(
      z.object({
        skateId: z.number(),
      }),
    )
    .mutation(({ input: { skateId } }) =>
      announceTeamsSkateHandler({ skateId }),
    ),
});
