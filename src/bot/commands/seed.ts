import { seedData } from "~/db/seeds";
import { getAllPlayers } from "../../features/players/players.db";
import { sendMessage } from "../../integrations/whatsapp/whatsapp.service";

export const execute = async (senderJid: string) => {
  const players = await getAllPlayers();

  if (players.length > 0) {
    sendMessage(senderJid, { text: "Data exists, not seeding again." });
    return;
  }

  await seedData();

  sendMessage(senderJid, { text: "Seeded data." });
};
