import {
  getBookingById,
  updateBooking,
} from "../../features/bookings/bookings.db";
import {
  deleteMessage,
  sendMessage,
} from "../../integrations/whatsapp/whatsapp.service";
import {
  formatList,
  titleCase,
} from "../../features/whatsapp/whatsapp.formatting";
import {
  doKeysMatch,
  getSenderFromMessage,
  PollOptions,
  WhatsAppMessage,
} from "~/features/whatsapp/whatsapp.model";
import { useState } from "../state";
import { Booking, BookingCreate } from "~/features/bookings/bookings.type";
import { Command } from "../commands";
import { getPrompt } from "./bookings.add";
import { bookingFieldPrompts } from "~/features/bookings/bookings.model";
import { Player } from "~/features/players/players.type";
import { updateBookingHandler } from "~/features/bookings/bookings.controller";

const FieldOptions = Object.keys(bookingFieldPrompts);

export const onCommand = async (
  message: WhatsAppMessage,
  sessionPlayer: Player,
  editBookingId: number
) => {
  const { setActiveCommand, updateBookings } = useState();
  const senderJid = getSenderFromMessage(message);

  let editBooking = await getBooking(editBookingId);
  if (editBooking == null) {
    await sendMessage(senderJid, {
      text: "📅 *No booking found to edit*",
    });
    return;
  }

  updateBookings(sessionPlayer.id, (draft) => {
    draft.update.bookingId = editBooking!.id;
  });
  setActiveCommand(sessionPlayer.id, Command.BookingsEdit);

  await sendEditBookingMessage(editBooking, senderJid);
  await sendEditPollMessage(senderJid, sessionPlayer);
};

export const onPollSelection = async (
  message: WhatsAppMessage,
  sessionPlayer: Player
) => {
  const { clearActiveCommand, updateBookings, getBookings } = useState();

  const senderJid = getSenderFromMessage(message);
  const state = getBookings(sessionPlayer.id)?.update;

  if (doKeysMatch(message.key, state?.field?.pollKey)) {
    await deleteMessage(senderJid, state!.field!.pollKey!);

    if (message.body === PollOptions.Cancel) {
      updateBookings(sessionPlayer.id, (draft) => {
        draft.update = {};
      });
      clearActiveCommand(sessionPlayer.id);
      return;
    }

    const field = message.body as keyof BookingCreate;
    const { prompt } = getPrompt(field);

    updateBookings(sessionPlayer.id, (draft) => {
      draft.update.field!.key = field;
      delete draft.update.field!.pollKey;
    });

    await sendMessage(senderJid, {
      text: prompt,
    });

    return;
  }
};

export const onMessage = async (
  message: WhatsAppMessage,
  sessionPlayer: Player
) => {
  const { updateBookings, getBookings } = useState();
  const senderJid = getSenderFromMessage(message);

  const state = getBookings(sessionPlayer.id)!.update;
  const bookingId = state.bookingId!;

  let editBooking = await getBooking(bookingId);
  if (!editBooking) {
    throw new Error("No booking found to edit");
  }

  if (state.field) {
    const { required, parse } = getPrompt(state.field.key!);
    const value = parse!(message.body!);
    if (required && !value) {
      await sendMessage(senderJid, {
        text: "⚠️ *Value is required*",
      });
      return;
    }

    editBooking = await updateBookingHandler(editBooking.id, {
      [state.field.key!]: value,
    });

    updateBookings(sessionPlayer.id, (draft) => {
      delete draft.update.field;
    });

    await sendMessage(senderJid, {
      text: `✅ *${titleCase(state.field.key!)} updated*`,
    });
  }

  await sendEditBookingMessage(editBooking!, senderJid);
  await sendEditPollMessage(senderJid, sessionPlayer);
};

const getBooking = async (bookingId: number) => {
  if (bookingId == null) {
    return null;
  }
  return await getBookingById(bookingId);
};

const sendEditBookingMessage = async (
  editBooking: Booking,
  senderJid: string
) => {
  await sendMessage(senderJid, {
    text: "🤕 *Edit Booking*",
  });
  await sendMessage(senderJid, {
    text: formatList([editBooking]),
  });
};

const sendEditPollMessage = async (
  senderJid: string,
  sessionPlayer: Player
) => {
  const poll = await sendMessage(senderJid, {
    poll: {
      name: "Which field would you like to edit?",
      values: [...FieldOptions, PollOptions.Cancel],
      selectableCount: 1,
    },
  });

  useState().updateBookings(sessionPlayer.id, (draft) => {
    draft.update.field = {
      pollKey: poll!.key,
    };
  });
};
