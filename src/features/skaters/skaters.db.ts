import { eq } from "drizzle-orm";
import { db } from "../../db";
import { skaters } from "../../db/schema";

export const getAllSkaters = async () => db.query.skaters.findMany();
export const getAllAdmins = async () =>
  db.query.skaters.findMany({
    where: eq(skaters.admin, true),
  });
