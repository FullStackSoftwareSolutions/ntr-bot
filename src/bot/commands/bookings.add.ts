import { Booking, BookingCreate } from "~/features/bookings/bookings.type";
import { sendMessage } from "../../integrations/whatsapp/whatsapp.service";
import { stringJoin } from "~/features/whatsapp/whatsapp.formatting";
import EventEmitter from "node:events";
import {
  getSenderFromMessage,
  getTextFromMessage,
  WhatsAppMessage,
} from "~/features/whatsapp/whatsapp.model";
import { Player } from "~/features/players/players.type";
import { createBookingHandler } from "~/features/bookings/bookings.controller";

const bookingsPending: {
  [playerId: number]: Partial<Booking>;
} = {};

const bookingStepPrompt: { [key in keyof Booking]?: string } = {
  name: "What would you like to name it?",
  numPlayers: "How many players are you booking for?",
  location: "Where will you be playing?",
  cost: "How much will it cost?",
  scheduledTime: "What time is it at?",
  startDate: "What day does it start?",
  endDate: "What day does it end?",
};

const bookingStepParse: { [key in keyof Booking]?: (value: string) => any } = {
  numPlayers: (value) => parseInt(value),
  cost: (value) => parseFloat(value),
};

const getPendingStep = (booking: Partial<Booking>) => {
  return Object.keys(bookingStepPrompt).find(
    (key) => !booking[key as keyof Booking]
  ) as keyof Booking;
};

export const execute = async (message: WhatsAppMessage, player: Player) => {
  const senderJid = getSenderFromMessage(message);

  let booking = bookingsPending[player.id];
  let firstMessage = false;
  if (!booking) {
    firstMessage = true;
    booking = bookingsPending[player.id] = {};
  }

  let currentStep = getPendingStep(booking);

  if (!firstMessage) {
    const messageText = getTextFromMessage(message);
    const parseMessage = bookingStepParse[currentStep] ?? ((x) => x);
    booking[currentStep] = parseMessage(messageText);

    currentStep = getPendingStep(booking);
  }

  if (!currentStep) {
    booking.bookedById = player.id;
    completed(message, booking as BookingCreate);
    return;
  }

  await sendMessage(senderJid, {
    text: getReply(firstMessage, currentStep),
  });
};

const getReply = (firstMessage: boolean, currentStep: keyof Booking) => {
  const prompt = bookingStepPrompt[currentStep]!;
  if (firstMessage) {
    return stringJoin(
      "📆 Let's create a new booking.",
      "══════════════════════════════════",
      prompt
    );
  }

  return prompt;
};

const commandEventEmitter = new EventEmitter();
const completed = async (message: WhatsAppMessage, booking: BookingCreate) => {
  await createBookingHandler(booking);

  const senderJid = getSenderFromMessage(message);
  await sendMessage(senderJid, {
    text: "Booking created! 🎉",
  });

  commandEventEmitter.emit("complete");
};

export const onComplete = (cb: () => void) => {
  commandEventEmitter.on("complete", cb);
};
