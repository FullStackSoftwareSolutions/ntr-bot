import { createTRPCRouter, protectedProcedure } from "@next/server/api/trpc";
import {
  announceSkatePaymentsHandler,
  announceSkateSpotsHandler,
  announceSkateTeamsHandler,
  getAllSkatesForBookingHandler,
  getAllSkatesHandler,
  getAnnounceSkatePaymentsTextHandler,
  getAnnounceSkateSpotsTextHandler,
  getAnnounceSkateTeamsTextHandler,
  getFutureSkatesHandler,
  getSkateAvailableSubsHandler,
  getSkateBySlugsHandler,
  shuffleTeamsSkateHandler,
  skateDeleteOneHandler,
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
  deleteOne: protectedProcedure
    .input(z.object({ skateId: z.number() }))
    .mutation(({ input: { skateId } }) => skateDeleteOneHandler({ skateId })),
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
        paid: z.boolean().optional(),
        refunded: z.boolean().optional(),
      }),
    )
    .mutation(({ input: { id, paid, refunded } }) =>
      skateUpdateSpotHandler({
        id,
        paid,
        refunded,
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
      announceSkateSpotsHandler({ skateId }),
    ),
  getAnnounceSpotsText: protectedProcedure
    .input(
      z.object({
        skateId: z.number(),
      }),
    )
    .query(({ input: { skateId } }) =>
      getAnnounceSkateSpotsTextHandler({ skateId }),
    ),
  announceTeams: protectedProcedure
    .input(
      z.object({
        skateId: z.number(),
      }),
    )
    .mutation(({ input: { skateId } }) =>
      announceSkateTeamsHandler({ skateId }),
    ),
  getAnnounceTeamsText: protectedProcedure
    .input(
      z.object({
        skateId: z.number(),
      }),
    )
    .query(({ input: { skateId } }) =>
      getAnnounceSkateTeamsTextHandler({ skateId }),
    ),
  announcePayments: protectedProcedure
    .input(
      z.object({
        skateId: z.number(),
      }),
    )
    .mutation(({ input: { skateId } }) =>
      announceSkatePaymentsHandler({ skateId }),
    ),
  getAnnouncePaymentsText: protectedProcedure
    .input(
      z.object({
        skateId: z.number(),
      }),
    )
    .query(({ input: { skateId } }) =>
      getAnnounceSkatePaymentsTextHandler({ skateId }),
    ),
});
