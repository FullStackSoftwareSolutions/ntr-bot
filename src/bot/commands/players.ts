import { getAllPlayers } from "../../features/players/players.db";
import { sendMessage } from "../../integrations/whatsapp/whatsapp.service";
import { formatTable } from "../../features/whatsapp/whatsapp.formatting";
import {
  getSenderFromMessage,
  WhatsAppMessage,
} from "~/features/whatsapp/whatsapp.model";

export const execute = async (message: WhatsAppMessage) => {
  const players = await getAllPlayers();
  const senderJid = getSenderFromMessage(message);

  if (players.length === 0) {
    sendMessage(senderJid, { text: "No players found" });
    return;
  }

  const reply = formatTable(players, {
    header: {
      content: "🏒 Players",
      alignment: "center",
    },
  });

  sendMessage(senderJid, { text: reply });
};
