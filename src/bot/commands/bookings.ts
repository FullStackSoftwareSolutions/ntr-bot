import { getAllBookings } from "../../features/bookings/bookings.db";
import { sendMessage } from "../../integrations/whatsapp/whatsapp.service";
import { formatList } from "../../features/whatsapp/whatsapp.formatting";
import {
  getSenderFromMessage,
  WhatsAppMessage,
} from "~/features/whatsapp/whatsapp.model";

export const execute = async (message: WhatsAppMessage) => {
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