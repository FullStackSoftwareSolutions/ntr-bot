import { createTRPCRouter, publicProcedure } from "@next/server/api/trpc";
import {
  announceSkateHandler,
  getAllFutureSkatesForBookingHandler,
  getAllSkatesForBookingHandler,
  getAllSkatesHandler,
  getFutureSkatesHandler,
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
  announce: publicProcedure
    .input(
      z.object({
        skateId: z.number(),
      }),
    )
    .mutation(({ input: { skateId } }) => announceSkateHandler({ skateId })),
});
