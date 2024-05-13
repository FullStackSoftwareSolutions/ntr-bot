import { type Player } from "@db/features/players/players.type";

export const getPlayerWhatsappJid = (player: Player) =>
  `${player.phoneNumber}@s.whatsapp.net`;

export const getPlayerName = (player: Player) =>
  player.nickname ?? player.fullName;

export const getPlayerInitials = (player: Player) => {
  const names = player.fullName.split(" ");

  if (names.length === 0) return "";
  if (names.length === 1) return names[0]!.charAt(0);

  return `${names[0]!.charAt(0)}${names[names.length - 1]!.charAt(0)}`;
};

export const getPlayerSkillLevel = (player: Player) => player.skillLevel ?? "C";
export const getPlayerSkillNumber = (player: Player) => {
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
