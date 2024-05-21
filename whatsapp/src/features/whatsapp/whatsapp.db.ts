import { eq } from "drizzle-orm";
import { db } from "../../db";
import { whatsappAuth } from "../../db/schema";

export const getWhatsappAuthData = async (key: string) => {
  const auth = await db.query.whatsappAuth.findFirst({
    where: eq(whatsappAuth.key, key),
  });
  return auth?.data;
};

export const upsertWhatsappAuthData = async (key: string, data: any) =>
  db.insert(whatsappAuth).values({ key, data }).onConflictDoUpdate({
    target: whatsappAuth.key,
    set: { data },
  });

export const deleteWhatsappAuthData = async (key: string) =>
  db.delete(whatsappAuth).where(eq(whatsappAuth.key, key));

export const deleteAllWhatsappAuthData = async () => db.delete(whatsappAuth);
