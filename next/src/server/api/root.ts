import { authRouter } from "@next/features/auth/auth.router";
import { bookingsRouter } from "@next/features/bookings/bookings.router";
import { playersRouter } from "@next/features/players/players.router";
import { skatesRouter } from "@next/features/skates/skates.router";
import { usersRouter } from "@next/features/users/users.router";
import { whatsappRouter } from "@next/features/whatsapp/whatsapp.router";
import { createCallerFactory, createTRPCRouter } from "@next/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  skates: skatesRouter,
  bookings: bookingsRouter,
  players: playersRouter,
  users: usersRouter,
  whatsapp: whatsappRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.skates.all();
 *       ^? Skates[]
 */
export const createCaller = createCallerFactory(appRouter);
