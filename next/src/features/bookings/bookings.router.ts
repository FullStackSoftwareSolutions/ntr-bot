import { createTRPCRouter, protectedProcedure } from "@next/server/api/trpc";
import {
  addBookingPlayerHandler,
  createBookingHandler,
  deleteBookingPlayerHandler,
  getAllBookingsHandler,
  getBookingBySlugHandler,
} from "./bookings.controller";
import { z } from "zod";
import { Positions } from "@db/features/skates/skates.type";

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
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        announceName: z.string(),
        numPlayers: z.number(),
        numGoalies: z.number(),
        location: z.string(),
        cost: z.string(),
        scheduledTime: z.string(),
        startDate: z.string(),
        endDate: z.string(),
        whatsAppGroupJid: z.string().nullable(),
        notifyGroup: z.boolean(),
      }),
    )
    .mutation(
      ({
        input: {
          name,
          announceName,
          numPlayers,
          numGoalies,
          location,
          cost,
          scheduledTime,
          startDate,
          endDate,
          whatsAppGroupJid,
          notifyGroup,
        },
        ctx: { user },
      }) =>
        createBookingHandler(
          {
            name,
            announceName,
            numPlayers,
            numGoalies,
            location,
            cost,
            scheduledTime,
            startDate,
            endDate,
            whatsAppGroupJid,
            notifyGroup,
          },
          user,
        ),
    ),
  deletePlayer: protectedProcedure
    .input(
      z.object({
        bookingId: z.number(),
        playerId: z.number(),
      }),
    )
    .mutation(({ input: { bookingId, playerId } }) =>
      deleteBookingPlayerHandler({ bookingId, playerId }),
    ),
  addPlayer: protectedProcedure
    .input(
      z.object({
        bookingId: z.number(),
        playerId: z.number(),
        position: z.nativeEnum(Positions),
      }),
    )
    .mutation(({ input: { bookingId, playerId, position } }) =>
      addBookingPlayerHandler({ bookingId, playerId, position }),
    ),
});
