import { table } from "table";
import { getAllSkaters } from "../../features/skaters/skaters.db";
import { sendMessage } from "../../integrations/whatsapp/whatsapp.service";
import {
  formatTable,
  stringJoin,
} from "../../features/whatsapp/whatsapp.model";

export default async function command(senderJid: string) {
  const skaters = await getAllSkaters();

  if (skaters.length === 0) {
    sendMessage(senderJid, "No skaters found");
    return;
  }

  const message = formatTable(skaters, {
    header: {
      content: "⛸️ Skaters",
      alignment: "center",
    },
  });

  sendMessage(senderJid, message);
}
