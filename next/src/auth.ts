import { Lucia, type User as LuciaUser, type Session } from "lucia";
import { GitHub } from "arctic";
import { env } from "./env";
import { cache } from "react";
import { cookies } from "next/headers";
import { adapter } from "@db/db/auth";
import { type User } from "@db/features/users/users.type";
import { getUserById, getUserByUsername } from "@db/features/users/users.db";
import { TRPCError } from "@trpc/server";

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    // this sets cookies with super long expiration
    // since Next.js doesn't allow Lucia to extend cookie expiration when rendering pages
    expires: false,
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      githubId: attributes.githubId,
      username: attributes.username,
    };
  },
});

export const validateRequest = cache(
  async (): Promise<
    { user: LuciaUser; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId);
    // next.js throws when you attempt to set cookie when rendering page
    try {
      if (result.session?.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
    } catch {}

    return result;
  },
);

// IMPORTANT!
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  githubId: number;
  username: string;
}

export const github = new GitHub(
  env.GITHUB_CLIENT_ID!,
  env.GITHUB_CLIENT_SECRET!,
);

export const getUserFromLuciaUserId = async (
  userId: string | null | undefined,
): Promise<User | null> => {
  if (env.DEV_USERNAME) {
    const user = await getUserByUsername(env.DEV_USERNAME);
    userId = user?.id ?? null;
  }

  if (userId == null) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const user = await getUserById(userId);
  return user ?? null;
};

export const getUserSession = async (): Promise<{
  user: User | null;
  session: Session | null;
}> => {
  const { session, user: luciaUser } = await validateRequest();
  if (!luciaUser) {
    return { session, user: null };
  }

  const user = await getUserFromLuciaUserId(luciaUser.id);

  return { session, user };
};
