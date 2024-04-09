import { sendMessage } from "../../integrations/whatsapp/whatsapp.service";
import {
  doKeysMatch,
  getSenderFromMessage,
  PollOptions,
  WhatsAppMessage,
} from "~/features/whatsapp/whatsapp.model";
import { Player } from "~/features/players/players.type";
import {
  getAllBookings,
  getBookingByName,
} from "~/features/bookings/bookings.db";
import { getSkatesForBooking } from "~/features/skates/skates.db";
import {
  usePlayerBookingState,
  usePlayerStore,
  useUpdatePlayerBookingState,
} from "../state";
import { Command } from "../commands";
import {
  onPollSelection as onPlayersPollSelection,
  sendBookingPlayersPollSelection,
} from "./bookings/players";
import { onPollSelection as onPaymentsPollSelection } from "./bookings/payments";
import { getBookingMessage } from "~/features/bookings/bookings.model";
import { sendBookingPaymentsPollSelection } from "./bookings/payments";
import { getSkateMessage } from "~/features/skates/skates.model";

enum BookingActionsPollOptions {
  Players = "Players",
  Skates = "Skates",
  Payments = "Payments",
}

export const onCommand = async (message: WhatsAppMessage, player: Player) => {
  usePlayerStore().setActiveCommand(player.id, Command.Bookings);

  await sendBookingPollMessage(message, player);
};

export const onMessage = async (message: WhatsAppMessage, player: Player) => {};

export const onPollSelection = async (
  message: WhatsAppMessage,
  player: Player
) => {
  const bookingState = usePlayerBookingState(player.id);
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
  const bookingState = usePlayerBookingState(player.id);

  if (bookingState?.read.bookingId) {
    return;
  }

  const bookings = await getAllBookings();
  const poll = await sendMessage(senderJid, {
    poll: {
      name: "Which booking would you like to view?",
      values: bookings.map((booking) => booking.name),
      selectableCount: 1,
    },
  });

  useUpdatePlayerBookingState(player.id, (draft) => {
    draft.read.bookingPollKey = poll!.key;
  });
};

const handleBookingPollSelection = async (
  message: WhatsAppMessage,
  player: Player
) => {
  const senderJid = getSenderFromMessage(message);
  const bookingState = usePlayerBookingState(player.id);

  const selectedBookingName = message.body;
  if (!selectedBookingName) {
    return;
  }

  const booking = await getBookingByName(selectedBookingName);
  if (!booking) {
    throw new Error("Booking not found!");
  }

  useUpdatePlayerBookingState(player.id, (draft) => {
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
  const bookingState = usePlayerBookingState(player.id);
  const bookingId = bookingState?.read.bookingId;
  if (!bookingId) {
    throw new Error("No booking selected!");
  }

  await sendMessage(senderJid, { delete: bookingState!.read.actionPollKey! });

  if (message.body === BookingActionsPollOptions.Skates) {
    const skates = await getSkatesForBooking(bookingId);

    await sendMessage(senderJid, {
      text: "🏒 *Skates*",
    });
    for (const skate of skates) {
      await sendMessage(senderJid, {
        text: getSkateMessage(skate),
      });
    }

    await bookingCommandPrompt(senderJid, player.id);
  }

  if (message.body === BookingActionsPollOptions.Players) {
    await sendBookingPlayersPollSelection(message, player);
  }

  if (message.body === BookingActionsPollOptions.Payments) {
    await sendBookingPaymentsPollSelection(message, player);
  }

  if (message.body === PollOptions.Cancel) {
    useUpdatePlayerBookingState(player.id, (draft) => {
      draft.read = {};
    });
    usePlayerStore().clearActiveCommand(player.id);
  }
};

export const bookingCommandPrompt = async (
  senderJid: string,
  playerId: number
) => {
  const bookingState = usePlayerBookingState(playerId);
  const existingPollKey = bookingState?.read.actionPollKey;

  if (existingPollKey) {
    await sendMessage(senderJid, { delete: existingPollKey });
    useUpdatePlayerBookingState(playerId, (draft) => {
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

  useUpdatePlayerBookingState(playerId, (draft) => {
    draft.read.actionPollKey = poll!.key;
  });
};
