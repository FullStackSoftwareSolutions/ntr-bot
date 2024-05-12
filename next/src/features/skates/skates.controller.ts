import {
  getAllSkates,
  getFutureSkatesForBooking,
  getSkatesForBooking,
} from "@db/features/skates/skates.db";

export const getAllSkatesHandler = async () => {
  return getAllSkates();
};

export const getAllSkatesForBookingHandler = async ({
  bookingId,
}: {
  bookingId: number;
}) => {
  return getSkatesForBooking(bookingId);
};

export const getAllFutureSkatesForBookingHandler = async ({
  bookingId,
}: {
  bookingId: number;
}) => {
  return getFutureSkatesForBooking(bookingId);
};

export const announceSkateHandler = async ({
  skateId,
}: {
  skateId: number;
}) => {
  console.log("whats app time bitch");
  // TODO
};
