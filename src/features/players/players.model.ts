import { Player } from "./players.type";

export const getPlayerWhatsappJid = (player: Player) =>
  `${player.phoneNumber}@s.whatsapp.net`;