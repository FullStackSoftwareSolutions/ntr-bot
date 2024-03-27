import { skates } from "~/db/schema";
import { db } from "../../db";

export const getAllSkates = async () => db.query.skates.findMany();

export const createSkate = async (skate: {
  scheduledOn: Date;
  bookingId: number;
}) => db.insert(skates).values([skate]).returning();
