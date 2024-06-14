import { formatList, stringJoin } from "../whatsapp/whatsapp.formatting";
import { getPlayerName } from "@next/features/players/players.model";
import { formatCurrency } from "@formatting/currency";
import {
  getSenderFromMessage,
  WhatsAppMessage,
} from "../whatsapp/whatsapp.model";
import {
  Booking,
  BookingWithoutPlayers,
} from "@db/features/bookings/bookings.type";
import {
  getDatesForBooking,
  getPlayersAmountPaidForBooking,
} from "@next/features/bookings/bookings.model";
import { formatDate } from "@formatting/dates";
import { Positions } from "@db/features/skates/skates.type";

export const getBookingNotifyJid = (
  booking: BookingWithoutPlayers,
  message?: WhatsAppMessage
) => {
  if (booking.notifyGroup && booking.whatsAppGroupJid) {
    return booking.whatsAppGroupJid;
  }
  if (message) {
    return getSenderFromMessage(message);
  }
};

export const getBookingMessage = (booking: Booking) => {
  const cost = Number(booking.cost ?? 0);
  const dates = getDatesForBooking(booking);
  const costPerSkate = cost / getDatesForBooking(booking).length;

  const players = booking.playersToBookings
    .filter(({ position }) => position === Positions.Player)
    .sort((a, b) => Number(b.amountPaid) - Number(a.amountPaid));

  const goalies = booking.playersToBookings.filter(
    ({ position }) => position === Positions.Goalie
  );

  const bookingPlayersRegistered = players.length;
  const bookingNumPlayers = booking.numPlayers;

  const bookingGoaliesRegistered = goalies.length;
  const bookingNumGoalies = booking.numGoalies;

  const costPerPlayer = cost / bookingNumPlayers;
  const costPerPlayerPerSkate = costPerSkate / bookingNumPlayers;

  const playersMessage =
    bookingPlayersRegistered === 0
      ? `None (${bookingNumPlayers} spots)`
      : `(${bookingPlayersRegistered}/${bookingNumPlayers}) ${players
          .map(
            ({ player, amountPaid }) =>
              `${getPlayerName(player)} (${formatCurrency(
                Number(amountPaid ?? 0)
              )})`
          )
          .join(", ")}`;

  const goaliesMessage =
    bookingGoaliesRegistered === 0
      ? `None (${bookingNumGoalies} spots)`
      : `(${bookingGoaliesRegistered}/${bookingNumGoalies}) ${goalies
          .map(({ player }) => getPlayerName(player))
          .join(", ")}`;

  return stringJoin(
    "📆 *Booking*",
    formatList([
      {
        id: booking.id,
        name: booking.name,
        skates: `(${dates.length}) ${dates.map(formatDate).join(", ")}`,
        playersPaid: formatCurrency(getPlayersAmountPaidForBooking(booking)),
        cost: formatCurrency(cost),
        costPerPlayer: formatCurrency(costPerPlayer),
        costPerSkate: formatCurrency(costPerSkate),
        costPerPlayerPerSkate: formatCurrency(costPerPlayerPerSkate),
        time: booking.scheduledTime,
        location: booking.location,
        players: playersMessage,
        goalies: goaliesMessage,
      },
    ])
  );
};
