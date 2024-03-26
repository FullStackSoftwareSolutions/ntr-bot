import { Skater } from "./skaters.type";

export const getSkaterWhatsappJid = (skater: Skater) =>
  `${skater.phoneNumber}@s.whatsapp.net`;
