import { getAllPlayers } from "../../features/players/players.db";
import { sendMessage } from "../../integrations/whatsapp/whatsapp.service";
import { formatTable } from "../../features/whatsapp/whatsapp.formatting";

export const execute = async (senderJid: string) => {
  const players = await getAllPlayers();

  if (players.length === 0) {
    sendMessage(senderJid, { text: "No players found" });
    return;
  }

  const message = formatTable(players, {
    header: {
      content: "🏒 Players",
      alignment: "center",
    },
  });

  sendMessage(senderJid, { text: message });
};
