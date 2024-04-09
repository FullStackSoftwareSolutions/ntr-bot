import { updatePlayersForBooking } from "../players/players.db";
import {
  createSkate,
  getSkatesForBooking,
  updateSkate,
} from "../skates/skates.db";
import { createBooking, getBookingById } from "./bookings.db";
import { getDatesForBooking } from "./bookings.model";

export const createBookingHandler = async (bookingData: {
  name: string;
  numPlayers: number;
  location: string;
  cost: string;
  scheduledTime: string;
  startDate: string;
  endDate: string;
  bookedById: number;
}) => {
  const booking = await createBooking(bookingData);

  if (!booking) {
    throw new Error("Failed to create booking");
  }

  for (const date of getDatesForBooking(booking)) {
    await createSkate({
      bookingId: booking.id,
      scheduledOn: date,
    });
  }

  return booking;
};

export const updateBookingDatesHandler = async (bookingId: number) => {
  const booking = await getBookingById(bookingId);
  if (!booking) {
    throw new Error("Booking not found");
  }

  const skates = await getSkatesForBooking(bookingId);
  for (const [index, date] of getDatesForBooking(booking).entries()) {
    const existingSkate = skates[index];
    if (existingSkate) {
      await updateSkate(existingSkate.id, { scheduledOn: date });
      continue;
    }

    await createSkate({
      bookingId: booking.id,
      scheduledOn: date,
    });
  }
};

export const updateBookingPlayersHandler = async (
  bookingId: number,
  removePlayerIds: number[],
  addPlayerIds: number[]
) => {
  await updatePlayersForBooking(bookingId, removePlayerIds, addPlayerIds);
};
