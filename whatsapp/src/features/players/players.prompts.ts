import { PlayerCreate } from "@db/features/players/players.type";
import {
  parseBoolean,
  parseEmail,
  parsePhoneNumber,
} from "@whatsapp/bot/inputs";

export const playerFieldPrompts: {
  [key in keyof PlayerCreate]?:
    | string
    | {
        prompt: string;
        required: boolean;
        parse?: (value: string) => any;
      };
} = {
  fullName: "What is their full name?",
  nickname: {
    prompt: "What is their nickname?",
    required: false,
  },
  email: {
    prompt: "What is their email?",
    required: true,
    parse: parseEmail,
  },
  phoneNumber: {
    prompt: "What is their phone number?",
    required: true,
    parse: parsePhoneNumber,
  },
  skillLevel: {
    prompt: "What is their skill level?",
    required: false,
  },
  isPlayer: {
    prompt: "Are they a player?",
    required: false,
    parse: parseBoolean,
  },
  isGoalie: {
    prompt: "Are they a goalie?",
    required: false,
    parse: parseBoolean,
  },
  notes: {
    prompt: "Any notes?",
    required: false,
  },
};
