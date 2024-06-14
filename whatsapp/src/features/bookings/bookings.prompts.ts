import { BookingCreate } from "@db/features/bookings/bookings.type";
import { parseBoolean } from "@whatsapp/bot/inputs";

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
  numGoalies: {
    prompt: "How many goalies are you booking for?",
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
  whatsAppGroupJid: {
    prompt: "What is the WhatsApp group JID?",
    required: false,
  },
  notifyGroup: {
    prompt: "Should the group by notified?",
    parse: parseBoolean,
    required: false,
  },
};
