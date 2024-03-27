import { seedData } from "~/db/seeds";
import { getAllPlayers } from "../../features/players/players.db";
import { sendMessage } from "../../integrations/whatsapp/whatsapp.service";
import {
  getSenderFromMessage,
  WhatsAppMessage,
} from "~/features/whatsapp/whatsapp.model";

export const execute = async (message: WhatsAppMessage) => {
  const players = await getAllPlayers();
  const senderJid = getSenderFromMessage(message);

  if (players.length > 0) {
    sendMessage(senderJid, { text: "Data exists, not seeding again." });
    return;
  }

  await seedData();

  sendMessage(senderJid, { text: "Seeded data." });
};
