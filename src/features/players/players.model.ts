import { Player } from "./players.type";

export const getPlayerWhatsappJid = (player: Player) =>
  `${player.phoneNumber}@s.whatsapp.net`;

export const getPlayerName = (player: Player) =>
  player.nickname ?? player.fullName;

export const getPlayerSkillLevel = (player: Player) => player.skillLevel ?? "C";
