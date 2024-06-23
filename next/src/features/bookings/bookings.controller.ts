import {
  addPlayerToBooking,
  deleteBooking,
  deletePlayerFromBooking,
  getAllBookings,
  getAllFutureBookings,
  getAllPastBookings,
  getBookingBySlug,
  updatePlayersForBooking,
} from "@db/features/bookings/bookings.db";
import {
  createSkate,
  deleteSkate,
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
import { type User } from "@db/features/users/users.type";
import { type Positions } from "@db/features/skates/skates.type";
import { formatDate, formatDateSlug } from "@formatting/dates";

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

export const createBookingHandler = async (
  bookingData: {
    name: string;
    announceName: string | null;
    numPlayers: number;
    numGoalies: number;
    location: string;
    cost: string;
    scheduledTime: string;
    startDate: string;
    endDate: string;
    whatsAppGroupJid: string | null;
    notifyGroup: boolean;
  },
  user: User,
) => {
  const slug = slugify(bookingData.name);
  const booking = await createBooking({
    slug,
    bookedByUserId: user.id,
    ...bookingData,
  });

  if (!booking) {
    throw new Error("Failed to create booking");
  }

  for (const date of getDatesForBooking(booking)) {
    await createSkate({
      slug: formatDateSlug(date),
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
  const newSkateDates = getDatesForBooking(booking);

  let existingSkateIndex = 0;
  for (const date of newSkateDates) {
    const existingSkate = skates[existingSkateIndex];
    if (existingSkate) {
      await updateSkate(existingSkate.id, { scheduledOn: date });
      existingSkateIndex++;
      continue;
    }

    await createSkate({
      slug: formatDateSlug(date),
      bookingId: booking.id,
      scheduledOn: date,
    });
  }

  for (let i = existingSkateIndex; i < skates.length; i++) {
    const skate = skates[i];
    if (skate) {
      await deleteSkate(skate.id);
    }
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

export const deleteBookingPlayerHandler = async ({
  bookingId,
  playerId,
}: {
  bookingId: number;
  playerId: number;
}) => {
  return deletePlayerFromBooking({ bookingId, playerId });
};

export const addBookingPlayerHandler = async ({
  bookingId,
  playerId,
  position,
}: {
  bookingId: number;
  playerId: number;
  position: Positions;
}) => {
  return addPlayerToBooking({ bookingId, playerId, position });
};

export const deleteBookingHandler = async ({
  bookingId,
}: {
  bookingId: number;
}) => {
  return deleteBooking(bookingId);
};
