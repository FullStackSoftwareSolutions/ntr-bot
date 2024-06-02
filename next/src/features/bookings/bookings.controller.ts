import {
  getAllBookings,
  getAllFutureBookings,
  getAllPastBookings,
  getBookingBySlug,
} from "@db/features/bookings/bookings.db";

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
