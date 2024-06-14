import {
  getAllBookings,
  getAllFutureBookings,
  getAllPastBookings,
  getBookingBySlug,
} from "@db/features/bookings/bookings.db";
import { updatePlayersForBooking } from "@db/features/players/players.db";
import {
  createSkate,
  getSkatesForBooking,
  updateSkate,
} from "@db/features/skates/skates.db";
import {
  createBooking,
  getBookingById,
  updateBooking,
} from "@db/features/bookings/bookings.db";
import { getDatesForBooking } from "@next/features/bookings/bookings.model";
import { type BookingCreate } from "@db/features/bookings/bookings.type";
import slugify from "slugify";

export const getAllBookingsHandler = async ({
  type,
}: {
  type: "future" | "past" | "all";
}) => {
  if (type === "future") {
    return getAllFutureBookings();
  }
  if (type === "past") {
    return getAllPastBookings();
  }

  return getAllBookings();
};

export const getBookingBySlugHandler = async (slug: string) => {
  return getBookingBySlug(slug);
};

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
  const slug = slugify(bookingData.name);
  const booking = await createBooking({
    slug,
    ...bookingData,
  });

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
  console.log(getDatesForBooking(booking));
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
  addPlayerIds: number[],
  position: string,
) => {
  await updatePlayersForBooking(
    bookingId,
    removePlayerIds,
    addPlayerIds,
    position,
  );
};

export const updateBookingHandler = async (
  bookingId: number,
  bookingData: Partial<BookingCreate>,
) => {
  const booking = await updateBooking(bookingId, bookingData);

  if (bookingData.scheduledTime) {
    await updateBookingDatesHandler(bookingId);
  }

  return booking;
};
