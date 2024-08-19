import {
  type BookingWithSkates,
  type Booking,
  type BookingWithoutPlayers,
} from "@db/features/bookings/bookings.type";
import { Positions } from "@db/features/skates/skates.type";
import { getDatesBetween } from "@formatting/dates/calendar";

export const getDatesForBooking = (
  booking: Omit<Booking, "playersToBookings">,
) => {
  if (!booking.startDate || !booking.endDate) {
    throw new Error("Booking is missing start or end date");
  }

  return getDatesBetween(
    `${booking.startDate}T${booking.scheduledTime}`,
    `${booking.endDate}T${booking.scheduledTime}`,
    "week",
  );
};

const getNumSkatesForBooking = (booking: BookingWithoutPlayers) => {
  return getDatesForBooking(booking).length;
};

export const getCostPerSkateForBooking = (booking: Booking) => {
  const cost = Number(booking.cost ?? 0);
  return cost / getNumSkatesForBooking(booking);
};

export const getCostPerSkatePerPlayerForBooking = (
  booking: BookingWithoutPlayers,
  roundUp = false,
) => {
  if (booking.costPerPlayerPerSkate) {
    return Number(booking.costPerPlayerPerSkate);
  }

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
  roundUp = false,
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
    0,
  );
};

export const getRemainingCostForBooking = (booking: Booking) => {
  return Number(booking.cost) - getPlayersAmountPaidForBooking(booking);
};

export const getBookingNumPlayersForPosition = (
  booking: Booking,
  position: Positions,
) => {
  if (position === Positions.Goalie) {
    return booking.numGoalies;
  }
  return booking.numPlayers;
};

export const getPlayersForBookingPosition = (
  booking: Booking,
  position: Positions,
) =>
  booking.playersToBookings.filter(
    (playerToBooking) => playerToBooking.position === position.toString(),
  );

export const doesBookingHavePastSkates = (booking: BookingWithSkates) => {
  const now = new Date();
  return booking.skates.some((skate) => skate.scheduledOn < now);
};
