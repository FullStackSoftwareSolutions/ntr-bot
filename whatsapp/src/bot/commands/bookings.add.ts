import { BookingCreate } from "@db/features/bookings/bookings.type";
import { sendMessage } from "../../integrations/whatsapp/whatsapp.service";
import {
  formatList,
  stringJoin,
} from "@whatsapp/features/whatsapp/whatsapp.formatting";
import {
  getSenderFromMessage,
  WhatsAppMessage,
} from "@whatsapp/features/whatsapp/whatsapp.model";
import { Player } from "@db/features/players/players.type";
import { createBookingHandler } from "@next/features/bookings/bookings.controller";
import { bookingFieldPrompts } from "@whatsapp/features/bookings/bookings.prompts";
import { useState } from "../state";
import { Command } from "../commands";

export const onCommand = async (
  message: WhatsAppMessage,
  sessionPlayer: Player
) => {
  const { setActiveCommand, updateBookings } = useState();
  setActiveCommand(sessionPlayer.id, Command.BookingsAdd);

  const senderJid = getSenderFromMessage(message);

  updateBookings(sessionPlayer.id, (draft) => {
    draft.create.booking = {};
  });

  const currentStep = getPendingStep({});
  await sendMessage(senderJid, {
    text: getReply(currentStep),
  });
};

export const onMessage = async (
  message: WhatsAppMessage,
  sessionPlayer: Player
) => {
  const { clearActiveCommand, updateBookings, getBookings } = useState();

  const senderJid = getSenderFromMessage(message);

  let newBooking = getBookings(sessionPlayer.id)?.create.booking!;
  let currentStep = getPendingStep(newBooking);
  const parsedMessage = getPrompt(currentStep)?.parse(message.body!);

  updateBookings(sessionPlayer.id, (draft) => {
    if (currentStep) {
      draft.create.booking![currentStep] = parsedMessage;
    }
  });

  newBooking = getBookings(sessionPlayer.id)?.create.booking!;
  currentStep = getPendingStep(newBooking);

  if (!currentStep) {
    await createBooking(message, newBooking as BookingCreate);
    updateBookings(sessionPlayer.id, (draft) => {
      delete draft.create.booking;
    });
    clearActiveCommand(sessionPlayer.id);
    return;
  }

  await sendMessage(senderJid, {
    text: getReply(currentStep),
  });
};

const getPromptData = (step: keyof BookingCreate) => {
  const prompt = bookingFieldPrompts[step]!;
  return typeof prompt === "string"
    ? {
        prompt,
        required: true,
      }
    : prompt;
};

export const getPrompt = (
  step: keyof BookingCreate
): {
  prompt: string;
  required: boolean;
  parse: (value: string) => any;
} => {
  const promptData = getPromptData(step);

  if (promptData && !promptData.parse) {
    promptData.parse = (value: string) => {
      if (!promptData.required && value === "!") {
        return null;
      }
      return value;
    };
  }

  return promptData as {
    prompt: string;
    required: boolean;
    parse: (value: string) => any;
  };
};

const getPendingStep = (booking: Partial<BookingCreate>) => {
  return Object.keys(bookingFieldPrompts).find((key) => {
    const promptData = getPromptData(key as keyof BookingCreate);
    if (promptData.required) {
      return booking[key as keyof BookingCreate] == null;
    }
    return booking[key as keyof BookingCreate] === undefined;
  }) as keyof BookingCreate;
};

const getReply = (currentStep: keyof BookingCreate) => {
  const { prompt } = getPrompt(currentStep);
  if (Object.keys(bookingFieldPrompts)[0] === currentStep) {
    return stringJoin(
      "📆 Let's create a new booking.",
      "══════════════════════════════════",
      prompt
    );
  }

  return prompt;
};

const createBooking = async (
  message: WhatsAppMessage,
  booking: BookingCreate
) => {
  const newBooking = await createBookingHandler(booking);

  const senderJid = getSenderFromMessage(message);
  await sendMessage(senderJid, {
    text: formatList([newBooking], {
      header: {
        content: "📅 *Booking created!*",
      },
    }),
  });
};
