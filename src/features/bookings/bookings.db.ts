import { bookings } from "~/db/schema";
import { db } from "../../db";

export const getAllBookings = async () => db.query.bookings.findMany();

export const createBooking = async (booking: {
  name: string;
  numPlayers: number;
  location: string;
  cost: string;
  scheduledTime: string;
  startDate: string;
  endDate: string;
}) => db.insert(bookings).values(booking).returning();
