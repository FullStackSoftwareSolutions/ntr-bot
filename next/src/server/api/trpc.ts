import { getUserById, getUserByUsername } from "@db/features/users/users.db";
import { type User } from "@db/features/users/users.type";
import { getUserFromLuciaUserId, validateRequest } from "@next/auth";
import { env } from "@next/env";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  if (env.DEV_USERNAME) {
    return {
      auth: null,
      ...opts,
    };
  }

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
  const userId = ctx.auth?.user?.id;
  const user = await getUserFromLuciaUserId(userId);
  if (
    user == null ||
    (!user.admin &&
      env.ADMIN_USERNAME != null &&
      env.ADMIN_USERNAME != user?.username)
  ) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      user,
    },
  });
});
export const protectedProcedure = t.procedure.use(isAuthed);
