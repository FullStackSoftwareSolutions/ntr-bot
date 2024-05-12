import { getAllBookings } from "../../features/bookings/bookings.db";
import { sendMessage } from "../../integrations/whatsapp/whatsapp.service";
import { formatList } from "../../features/whatsapp/whatsapp.formatting";
import {
  getSenderFromMessage,
  WhatsAppMessage,
} from "@whatsapp/features/whatsapp/whatsapp.model";
import { Player } from "@whatsapp/features/players/players.type";

export const onCommand = async (message: WhatsAppMessage, player: Player) => {
  const bookings = await getAllBookings();
  const senderJid = getSenderFromMessage(message);

  if (bookings.length === 0) {
    sendMessage(senderJid, { text: "No bookings found" });
    return;
  }

  await sendMessage(senderJid, { text: "📆 *Bookings*" });

  for (const booking of bookings) {
    const text = formatList([booking]);
    await sendMessage(senderJid, { text });
  }
};
