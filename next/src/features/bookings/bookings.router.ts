import { createTRPCRouter, protectedProcedure } from "@next/server/api/trpc";
import {
  createBookingHandler,
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
});
