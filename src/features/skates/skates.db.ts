import { skates } from "~/db/schema";
import { db } from "../../db";
import { eq } from "drizzle-orm";

export const getSkateById = async (id: number) => {
  const [skate] = await db.query.skates.findMany({
    where: eq(skates.id, id),
    with: {
      booking: true,
      playersToSkates: {
        with: {
          player: true,
        },
      },
    },
  });
  if (!skate) {
    throw new Error(`Skate with id ${id} not found`);
  }

  return skate;
};

export const getAllSkates = async () => db.query.skates.findMany();
export const getSkatesForBooking = async (bookingId: number) =>
  db.query.skates.findMany({ where: eq(skates.bookingId, bookingId) });

export const createSkate = async (skate: {
  scheduledOn: Date;
  bookingId: number;
}) => db.insert(skates).values([skate]).returning();
