//import { auth } from "@clerk/nextjs/server";
import {
  getPlayerByEmail,
  getPlayerById,
} from "@db/features/players/players.db";
import { env } from "@next/env";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  if (env.DEV_USER) {
    return {
      auth: null,
      ...opts,
    };
  }

  //const clerkAuth = auth();
  return {
    auth: null, //clerkAuth,
    ...opts,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

const isAuthed = t.middleware(async ({ next, ctx }) => {
  if (env.DEV_USER) {
    const user = await getPlayerByEmail(env.DEV_USER);
    return next({
      ctx: {
        user,
      },
    });
  }

  if (!ctx.auth?.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const user = await getPlayerById(ctx.auth.userId);
  if (!user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      user,
    },
  });
});
export const protectedProcedure = t.procedure.use(isAuthed);
