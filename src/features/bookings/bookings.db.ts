import { bookings } from "~/db/schema";
import { db } from "../../db";
import { eq } from "drizzle-orm";

export const getAllBookings = async () => db.query.bookings.findMany();
export const getBookingById = async (id: number) =>
  db.query.bookings.findMany({
    where: eq(bookings.id, id),
    with: {
      players: true,
    },
  });

export const createBooking = async (booking: {
  name: string;
  numPlayers: number;
  location: string;
  cost: string;
  scheduledTime: string;
  startDate: string;
  endDate: string;
}) => db.insert(bookings).values(booking).returning();
