import {
  getAllBookings,
  getAllFutureBookings,
  getBookingBySlug,
} from "@db/features/bookings/bookings.db";

export const getAllBookingsHandler = async () => {
  return getAllBookings();
};

export const getAllFutureBookingsHandler = async () => {
  return getAllFutureBookings();
};

export const getBookingBySlugHandler = async (slug: string) => {
  return getBookingBySlug(slug);
};
