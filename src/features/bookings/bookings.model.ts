import dayjs from "dayjs";
import { Booking } from "./bookings.type";

import utcPlugin from "dayjs/plugin/utc";

dayjs.extend(utcPlugin);

export const getDatesForBooking = (booking: Booking) => {
  if (!booking.startDate || !booking.endDate) {
    throw new Error("Booking is missing start or end date");
  }

  const dates = [];

  let date = dayjs.utc(`${booking.startDate}T${booking.scheduledTime}Z`);
  while (!date.isAfter(`${booking.endDate}T${booking.scheduledTime}Z`)) {
    dates.push(date.toDate());

    date = date.add(1, "week");
  }

  return dates;
};
