import {
  addPlayerToBooking,
  deleteBooking,
  deletePlayerFromBooking,
  getAllBookings,
  getAllFutureBookings,
  getAllPastBookings,
  getBookingBySlug,
  updatePlayerBooking,
  updatePlayersForBooking,
} from "@db/features/bookings/bookings.db";
import {
  addPlayersToSkate,
  createSkate,
  deleteSkate,
  getSkatesForBooking,
  updateSkate,
  updateSkatePlayer,
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
import { formatDateSlug } from "@formatting/dates";
import { getCostPerSkatePerPlayerForBooking } from "@next/features/bookings/bookings.model";

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
  bookingData: Omit<BookingCreate, "slug" | "bookedByUserId">,
  user: User,
) => {
  const slug = slugify(bookingData.name);
  const booking = await createBooking({
    ...bookingData,
    slug,
    bookedByUserId: user.id,
  });

  if (!booking) {
    throw new Error("Failed to create booking");
  }

  for (const date of bookingData.dates) {
    await createSkate({
      slug: formatDateSlug(new Date(date)),
      bookingId: booking.id,
      scheduledOn: new Date(`${date}T${booking.scheduledTime}`),
    });
  }

  return booking;
};

export const updateBookingDatesHandler = async (
  bookingId: number,
  dates: string[],
) => {
  const booking = await getBookingById(bookingId);
  if (!booking) {
    throw new Error("Booking not found");
  }

  const start = booking.startDate;
  const end = booking.endDate;
  if (!start || !end) {
    throw new Error("Booking is missing start or end date");
  }

  const skates = await getSkatesForBooking(bookingId);
  //const newSkateDates = getDatesForBooking(booking);

  const validDates = dates.filter((date) => {
    return new Date(date) >= new Date(start) && new Date(date) <= new Date(end);
  });

  let existingSkateIndex = 0;
  for (const date of validDates) {
    const scheduledOn = new Date(`${date}T${booking.scheduledTime}`);

    const existingSkate = skates[existingSkateIndex];
    if (existingSkate) {
      await updateSkate(existingSkate.id, { scheduledOn });
      existingSkateIndex++;
      continue;
    }

    const skate = await createSkate({
      slug: formatDateSlug(scheduledOn),
      bookingId: booking.id,
      scheduledOn,
    });

    if (!skate) {
      throw new Error("Failed to create skate");
    }

    await addPlayersToSkate(skate.id, booking.playersToBookings);
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

  if (bookingData.scheduledTime && bookingData.dates) {
    await updateBookingDatesHandler(bookingId, bookingData.dates);
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

export const updateBookingPlayerHandler = async (
  playerBookingId: number,
  {
    amountPaid,
  }: {
    amountPaid: string | null;
  },
) => {
  if (amountPaid === "") {
    amountPaid = null;
  }

  const [updatedSpot] = await updatePlayerBooking(playerBookingId, {
    amountPaid,
  });

  if (updatedSpot) {
    const skates = await getSkatesForBooking(updatedSpot.bookingId);
    const booking = skates[0]?.booking;
    if (booking) {
      let remainingPaidAmount = Number(updatedSpot.amountPaid ?? 0);
      const costPerSkate = getCostPerSkatePerPlayerForBooking(booking);

      for (const skate of skates) {
        const playerToSkate = skate.playersToSkates.find(
          (p) => p.playerId === updatedSpot.playerId,
        );
        if (!playerToSkate) {
          continue;
        }

        await updateSkatePlayer(playerToSkate.id, {
          paid: remainingPaidAmount >= costPerSkate,
        });

        remainingPaidAmount -= costPerSkate;
      }
    }
  }
  return updatedSpot;
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
