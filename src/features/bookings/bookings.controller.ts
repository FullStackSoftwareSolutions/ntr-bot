import { createSkate } from "../skates/skates.db";
import { createBooking } from "./bookings.db";
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
};
