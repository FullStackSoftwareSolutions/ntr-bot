import { Player, PlayerCreate } from "@db/features/players/players.type";
import {
  parseBoolean,
  parseEmail,
  parsePhoneNumber,
} from "@whatsapp/bot/inputs";

export const getPlayerWhatsappJid = (player: Player) =>
  `${player.phoneNumber}@s.whatsapp.net`;

export const getPlayerName = (player: Player) =>
  player.nickname ?? player.fullName;

export const getPlayerSkillLevel = (player: Player) =>
  player.skillLevelLetter ?? "C";
export const getPlayerSkillNumber = (player: Player) => {
  if (player.skillLevel != null) {
    return player.skillLevel;
  }

  const skillLevel = getPlayerSkillLevel(player);
  switch (skillLevel) {
    case "A":
      return 10;
    case "B":
      return 7;
    case "C":
      return 4;
    case "D":
      return 2;
    default:
      return 5;
  }
};

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
