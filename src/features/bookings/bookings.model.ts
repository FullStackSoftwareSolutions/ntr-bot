import dayjs from "dayjs";
import { Booking } from "./bookings.type";

import utcPlugin from "dayjs/plugin/utc";
import { formatList, stringJoin } from "../whatsapp/whatsapp.formatting";
import { getPlayerName } from "../players/players.model";

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

export const getBookingMessage = (booking: Booking) => {
  const cost = Number(booking.cost ?? 0);
  const dates = getDatesForBooking(booking);
  const costPerSkate = cost / getDatesForBooking(booking).length;
  const bookingNumPlayers = booking.playersToBookings.length;
  const costPerPlayer = cost / bookingNumPlayers;
  const costPerPlayerPerSkate = costPerSkate / bookingNumPlayers;

  const currenyFormatter = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  });

  return stringJoin(
    "📆 *Booking*",
    formatList([
      {
        name: booking.name,
        skates: `(${dates.length}) ${dates
          .map((date) => dayjs(date).format("MMM D"))
          .join(", ")}`,
        cost: currenyFormatter.format(cost),
        costPerPlayer: currenyFormatter.format(costPerPlayer),
        costPerSkate: currenyFormatter.format(costPerSkate),
        costPerPlayerPerSkate: currenyFormatter.format(costPerPlayerPerSkate),
        time: booking.scheduledTime,
        location: booking.location,
        players: `(${bookingNumPlayers}/${
          booking.numPlayers
        }) ${booking.playersToBookings
          .sort((a, b) => Number(a.amountPaid) - Number(b.amountPaid))
          .sort(
            (a, b) =>
              a.player.dateAdded.getTime() - b.player.dateAdded.getTime()
          )
          .map(
            ({ player, amountPaid }) =>
              `${getPlayerName(player)} (${currenyFormatter.format(
                Number(amountPaid ?? 0)
              )})`
          )
          .join(", ")}`,
      },
    ])
  );
};
