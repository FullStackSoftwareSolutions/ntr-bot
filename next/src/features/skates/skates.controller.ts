import { getBookingBySlug } from "@db/features/bookings/bookings.db";
import {
  getAllSkates,
  getFutureSkates,
  getFutureSkatesForBooking,
  getSkateBySlugAndBooking,
  getSkateBySlugs,
  getSkatesForBooking,
} from "@db/features/skates/skates.db";
import { getJidFromNumber } from "@whatsapp/features/whatsapp/whatsapp.model";
import { trpc } from "@whatsapp/trpc/client";

export const getAllSkatesHandler = async () => {
  return getAllSkates();
};

export const getFutureSkatesHandler = async () => {
  return getFutureSkates();
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

export const getSkateBySlugsHandler = async ({
  bookingSlug,
  skateSlug,
}: {
  bookingSlug: string;
  skateSlug: string;
}) => {
  const booking = await getBookingBySlug(bookingSlug);
  if (!booking) {
    return null;
  }

  return getSkateBySlugAndBooking({
    slug: skateSlug,
    bookingId: booking.id,
  });
};

export const announceSkateHandler = async ({
  skateId,
}: {
  skateId: number;
}) => {
  const message = await trpc.sendMessage.mutate({
    toJid: getJidFromNumber("+14164644510"),
    message: "test",
  });
  // TODO
};
