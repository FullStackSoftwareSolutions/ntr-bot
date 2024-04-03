import { bookings, playersToBookings } from "~/db/schema";
import { db } from "../../db";
import { and, eq, inArray } from "drizzle-orm";

export const getAllBookings = async () => db.query.bookings.findMany();
export const getBookingById = async (id: number) =>
  db.query.bookings.findFirst({
    with: {
      playersToBookings: {
        with: {
          player: true,
        },
      },
    },
    where: eq(bookings.id, id),
  });

export const getBookingByName = async (name: string) =>
  db.query.bookings.findFirst({
    with: {
      playersToBookings: {
        with: {
          player: true,
        },
      },
    },
    where: eq(bookings.name, name),
  });

export const createBooking = async (bookingData: {
  name: string;
  numPlayers: number;
  location: string;
  cost: string;
  scheduledTime: string;
  startDate: string;
  endDate: string;
}) => {
  const [booking] = await db.insert(bookings).values(bookingData).returning();
  return booking;
};

export const updateBookingPlayersAmountPaid = async (
  bookingId: number,
  playerIds: number[],
  amountPaid: string
) => {
  await db
    .update(playersToBookings)
    .set({ amountPaid })
    .where(
      and(
        eq(playersToBookings.bookingId, bookingId),
        inArray(playersToBookings.playerId, playerIds)
      )
    );
};
