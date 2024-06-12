import { db } from "@db/db";
import { users } from "@db/db/schema";
import { eq } from "drizzle-orm";
import { UserUpdate } from "./users.type";

export const getAllUsers = () => db.query.users.findMany();

export const getUserById = async (id: string) =>
  await db.query.users.findFirst({
    with: {
      player: true,
    },
    where: eq(users.id, id),
  });

export const getUserByUsername = async (username: string) =>
  await db.query.users.findFirst({
    where: eq(users.username, username),
  });

export const getUserByGithubId = async (githubId: number) =>
  await db.query.users.findFirst({
    where: eq(users.githubId, githubId),
  });

export const createUser = async ({
  id,
  username,
  githubId,
}: {
  id: string;
  username: string;
  githubId: number;
}) => {
  await db.insert(users).values({
    id,
    username,
    githubId,
  });
};

export const deleteUser = async ({ id }: { id: string }) => {
  await db.delete(users).where(eq(users.id, id));
};

export const updateUser = async (id: string, userData: UserUpdate) => {
  const [user] = await db
    .update(users)
    .set(userData)
    .where(eq(users.id, id))
    .returning();
  if (!user) throw new Error("Failed to update user");

  return user;
};
