import { sendMessage } from "../../integrations/whatsapp/whatsapp.service";
import {
  doKeysMatch,
  getSenderFromMessage,
  PollOptions,
  WhatsAppMessage,
} from "@whatsapp/features/whatsapp/whatsapp.model";
import { Player } from "@db/features/players/players.type";
import {
  getAllFutureBookings,
  getBookingByName,
} from "@db/features/bookings/bookings.db";
import { getFutureSkatesForBooking } from "@db/features/skates/skates.db";
import { useBookingState, useState, useUpdateBookingState } from "../state";
import { Command } from "../commands";
import {
  onPollSelection as onPlayersPollSelection,
  sendBookingPlayersPollSelection,
} from "./bookings/players";
import { onPollSelection as onPaymentsPollSelection } from "./bookings/payments";
import { getBookingMessage } from "@whatsapp/features/bookings/bookings.messages";
import { sendBookingPaymentsPollSelection } from "./bookings/payments";
import { getSkatesMessage } from "@whatsapp/features/skates/skates.messages";

enum BookingActionsPollOptions {
  Players = "Players",
  Skates = "Skates",
  Payments = "Payments",
}

export const onCommand = async (message: WhatsAppMessage, player: Player) => {
  useState().setActiveCommand(player.id, Command.Bookings);

  await sendBookingPollMessage(message, player);
};

export const onMessage = async (message: WhatsAppMessage, player: Player) => {};

export const onPollSelection = async (
  message: WhatsAppMessage,
  player: Player
) => {
  const bookingState = useBookingState(player.id);
  const bookingPollKey = bookingState?.read.bookingPollKey;
  const actionPollKey = bookingState?.read.actionPollKey;

  if (doKeysMatch(actionPollKey, message.key!)) {
    return handleBookingActionPollSelection(message, player);
  }
  if (doKeysMatch(bookingPollKey, message.key)) {
    return handleBookingPollSelection(message, player);
  }

  onPlayersPollSelection(message, player);
  onPaymentsPollSelection(message, player);
};

const sendBookingPollMessage = async (
  message: WhatsAppMessage,
  player: Player
) => {
  const senderJid = getSenderFromMessage(message);
  const bookingState = useBookingState(player.id);

  if (bookingState?.read.bookingId) {
    return;
  }

  const bookings = await getAllFutureBookings();
  const poll = await sendMessage(senderJid, {
    poll: {
      name: "Which booking would you like to view?",
      values: bookings.map((booking) => booking.name),
      selectableCount: 1,
    },
  });

  useUpdateBookingState(player.id, (draft) => {
    draft.read.bookingPollKey = poll!.key;
  });
};

const handleBookingPollSelection = async (
  message: WhatsAppMessage,
  player: Player
) => {
  const senderJid = getSenderFromMessage(message);
  const bookingState = useBookingState(player.id);

  const selectedBookingName = message.body;
  if (!selectedBookingName) {
    return;
  }

  const booking = await getBookingByName(selectedBookingName);
  if (!booking) {
    throw new Error("Booking not found!");
  }

  useUpdateBookingState(player.id, (draft) => {
    draft.read.bookingId = booking.id;
  });

  await sendMessage(senderJid, { delete: bookingState!.read.bookingPollKey! });
  await sendMessage(senderJid, {
    text: getBookingMessage(booking),
  });

  await bookingCommandPrompt(senderJid, player.id);
};

const handleBookingActionPollSelection = async (
  message: WhatsAppMessage,
  player: Player
) => {
  const senderJid = getSenderFromMessage(message);
  const bookingState = useBookingState(player.id);
  const bookingId = bookingState?.read.bookingId;
  if (!bookingId) {
    throw new Error("No booking selected!");
  }

  await sendMessage(senderJid, { delete: bookingState!.read.actionPollKey! });

  if (message.body === BookingActionsPollOptions.Skates) {
    const skates = await getFutureSkatesForBooking(bookingId);

    await sendMessage(senderJid, {
      text: getSkatesMessage(skates),
    });

    await bookingCommandPrompt(senderJid, player.id);
  }

  if (message.body === BookingActionsPollOptions.Players) {
    await sendBookingPlayersPollSelection(message, player);
  }

  if (message.body === BookingActionsPollOptions.Payments) {
    await sendBookingPaymentsPollSelection(message, player);
  }

  if (message.body === PollOptions.Cancel) {
    useUpdateBookingState(player.id, (draft) => {
      draft.read = {};
    });
    useState().clearActiveCommand(player.id);
  }
};

export const bookingCommandPrompt = async (
  senderJid: string,
  playerId: number
) => {
  const bookingState = useBookingState(playerId);
  const existingPollKey = bookingState?.read.actionPollKey;

  if (existingPollKey) {
    await sendMessage(senderJid, { delete: existingPollKey });
    useUpdateBookingState(playerId, (draft) => {
      delete draft.read.actionPollKey;
    });
  }

  const poll = await sendMessage(senderJid, {
    poll: {
      name: "Select an action for this booking",
      values: [...Object.values(BookingActionsPollOptions), PollOptions.Cancel],
      selectableCount: 1,
    },
  });

  useUpdateBookingState(playerId, (draft) => {
    draft.read.actionPollKey = poll!.key;
  });
};
