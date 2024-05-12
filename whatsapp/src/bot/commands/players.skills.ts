import { sendMessage } from "../../integrations/whatsapp/whatsapp.service";
import {
  formatList,
  formatStringList,
} from "../../features/whatsapp/whatsapp.formatting";
import {
  getSenderFromMessage,
  WhatsAppMessage,
} from "@whatsapp/features/whatsapp/whatsapp.model";
import { Player } from "@whatsapp/features/players/players.type";
import {
  getAllGoalies,
  getAllPlayers,
} from "@whatsapp/features/players/players.db";
import { sortPlayers } from "@whatsapp/features/skates/skates.model";
import {
  getPlayerName,
  getPlayerSkillLevel,
  getPlayerSkillNumber,
} from "@whatsapp/features/players/players.model";

export const onCommand = async (message: WhatsAppMessage, player: Player) => {
  const players = await getAllPlayers();
  const goalies = await getAllGoalies();

  const senderJid = getSenderFromMessage(message);

  if (players.length === 0) {
    sendMessage(senderJid, { text: "No players found" });
    return;
  }

  const sortedPlayers = sortPlayers(players);
  const playersText = formatStringList(
    sortedPlayers.map(
      (player) =>
        `[${getPlayerSkillLevel(player)}-${getPlayerSkillNumber(
          player
        )}] ${getPlayerName(player)}`
    ),
    {
      header: {
        content: "🏒 *Players*",
      },
    }
  );
  await sendMessage(senderJid, { text: playersText });

  if (goalies.length === 0) {
    sendMessage(senderJid, { text: "No goalies found" });
    return;
  }

  const sortedGoalies = sortPlayers(goalies);
  const goaliesText = formatStringList(
    sortedGoalies.map(
      (player) =>
        `[${getPlayerSkillLevel(player)}-${getPlayerSkillNumber(
          player
        )}] ${getPlayerName(player)}`
    ),
    {
      header: {
        content: "🏒 *Goalies*",
      },
    }
  );
  await sendMessage(senderJid, { text: goaliesText });
};
