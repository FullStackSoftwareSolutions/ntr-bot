import { getAllBookings } from "../../features/bookings/bookings.db";
import { sendMessage } from "../../integrations/whatsapp/whatsapp.service";
import { formatList } from "../../features/whatsapp/whatsapp.formatting";
import {
  getSenderFromMessage,
  WhatsAppMessage,
} from "~/features/whatsapp/whatsapp.model";
import { useState } from "../state";
import { Command } from "../commands";
import { Player } from "~/features/players/players.type";

export const onCommand = async (message: WhatsAppMessage, player: Player) => {
  //const { setActiveCommand } = usePlayerStore();
  //setActiveCommand(player.id, Command.Bookings);

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

export const onReaction = async (message: WhatsAppMessage) => {
  const senderJid = getSenderFromMessage(message);

  //await sendMessage(senderJid, { text: message.body! });
};
