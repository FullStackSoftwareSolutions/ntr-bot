import { getAllBookings } from "../../features/bookings/bookings.db";
import { sendMessage } from "../../integrations/whatsapp/whatsapp.service";
import { formatTable } from "../../features/whatsapp/whatsapp.formatting";
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

  const reply = formatTable(bookings, {
    header: {
      content: "📆 Bookings",
      alignment: "center",
    },
  });

  sendMessage(senderJid, { text: reply });
};
