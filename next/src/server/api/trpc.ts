import { getPlayerByEmail } from "@db/features/players/players.db";
import { getUserById } from "@db/features/users/users.db";
import { validateRequest } from "@next/auth";
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
  const auth = await validateRequest();
  return {
    auth,
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

  if (!ctx.auth?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const user = await getUserById(ctx.auth.user.id);
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
