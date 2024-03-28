import dayjs from "dayjs";
import { Booking } from "./bookings.type";

import utcPlugin from "dayjs/plugin/utc";

dayjs.extend(utcPlugin);

export const getDatesForBooking = (booking: Booking) => {
  if (!booking.startDate || !booking.endDate) {
    throw new Error("Booking is missing start or end date");
  }

  const dates = [];

  let date = dayjs(`${booking.startDate}T${booking.scheduledTime}`);
  while (!date.isAfter(`${booking.endDate}T${booking.scheduledTime}`)) {
    dates.push(date.toDate());

    date = date.add(1, "week");
  }

  return dates;
};
