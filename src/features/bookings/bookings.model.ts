import dayjs from "dayjs";
import { Booking, BookingCreate } from "./bookings.type";

import utcPlugin from "dayjs/plugin/utc";
import { formatList, stringJoin } from "../whatsapp/whatsapp.formatting";
import { getPlayerName } from "../players/players.model";
import { formatCurrency } from "~/formatting/currency";

dayjs.extend(utcPlugin);

export const getDatesForBooking = (
  booking: Omit<Booking, "playersToBookings">
) => {
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

const getNumSkatesForBooking = (booking: Booking) => {
  return getDatesForBooking(booking).length;
};

export const getCostPerSkateForBooking = (booking: Booking) => {
  const cost = Number(booking.cost ?? 0);
  return cost / getNumSkatesForBooking(booking);
};

export const getCostPerSkatePerPlayerForBooking = (
  booking: Booking,
  roundUp = false
) => {
  const cost = Number(booking.cost ?? 0);
  const costPerPlayer = cost / (booking.numPlayers ?? 0);
  const costPerPlayerPerSkate = costPerPlayer / getNumSkatesForBooking(booking);

  if (roundUp) {
    return Math.ceil(costPerPlayerPerSkate / 5) * 5;
  }
  return costPerPlayerPerSkate;
};

export const getCostPerPlayerForBooking = (
  booking: Booking,
  roundUp = false
) => {
  const costPerSkate = getCostPerSkatePerPlayerForBooking(booking, roundUp);
  return costPerSkate * getDatesForBooking(booking).length;
};

export const getPaymentAmountsForBooking = (booking: Booking) => {
  //const costPerPlayer = getCostPerSkatePerPlayerForBooking(booking, true);

  const paymentAmounts = [Number(booking.costPerPlayer ?? 0)];

  // for (let i = 0; i < getNumSkatesForBooking(booking); i++) {
  //   paymentAmounts.push(costPerPlayer * (i + 1));
  // }

  return paymentAmounts;
};

export const getPlayersAmountPaidForBooking = (booking: Booking) => {
  return booking.playersToBookings.reduce(
    (total, { amountPaid }) => total + Number(amountPaid ?? 0),
    0
  );
};

export const getBookingMessage = (booking: Booking) => {
  const cost = Number(booking.cost ?? 0);
  const dates = getDatesForBooking(booking);
  const costPerSkate = cost / getDatesForBooking(booking).length;

  const bookingPlayersRegistered = booking.playersToBookings.length;
  const bookingNumPlayers = booking.numPlayers ?? 0;
  const costPerPlayer = cost / bookingNumPlayers;
  const costPerPlayerPerSkate = costPerSkate / bookingNumPlayers;

  const players =
    bookingPlayersRegistered === 0
      ? `None (${bookingNumPlayers} spots)`
      : `(${bookingPlayersRegistered}/${bookingNumPlayers}) ${booking.playersToBookings
          .sort((a, b) => Number(b.amountPaid) - Number(a.amountPaid))
          .map(
            ({ player, amountPaid }) =>
              `${getPlayerName(player)} (${formatCurrency(
                Number(amountPaid ?? 0)
              )})`
          )
          .join(", ")}`;

  return stringJoin(
    "📆 *Booking*",
    formatList([
      {
        name: booking.name,
        skates: `(${dates.length}) ${dates
          .map((date) => dayjs(date).format("MMM D"))
          .join(", ")}`,
        playersPaid: formatCurrency(getPlayersAmountPaidForBooking(booking)),
        cost: formatCurrency(cost),
        costPerPlayer: formatCurrency(costPerPlayer),
        costPerSkate: formatCurrency(costPerSkate),
        costPerPlayerPerSkate: formatCurrency(costPerPlayerPerSkate),
        time: booking.scheduledTime,
        location: booking.location,
        players,
      },
    ])
  );
};

export const bookingFieldPrompts: {
  [key in keyof BookingCreate]?:
    | string
    | {
        prompt: string;
        required: boolean;
        parse?: (value: string) => any;
      };
} = {
  name: "What would you like to name it?",
  numPlayers: {
    prompt: "How many players are you booking for?",
    parse: (value) => parseInt(value),
    required: true,
  },
  location: "Where will you be playing?",
  cost: {
    prompt: "How much will it cost?",
    parse: (value) => parseFloat(value),
    required: true,
  },
  scheduledTime: "What time is it at?",
  startDate: "What day does it start?",
  endDate: "What day does it end?",
};
