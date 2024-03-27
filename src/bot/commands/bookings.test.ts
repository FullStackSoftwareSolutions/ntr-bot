import { sendMessage } from "../../integrations/whatsapp/whatsapp.service";
import { stringJoin } from "~/features/whatsapp/whatsapp.formatting";
import {
  getSenderFromMessage,
  WhatsAppMessage,
} from "~/features/whatsapp/whatsapp.model";
import { Player } from "~/features/players/players.type";
import { createBookingHandler } from "~/features/bookings/bookings.controller";

export const execute = async (message: WhatsAppMessage, player: Player) => {
  const senderJid = getSenderFromMessage(message);

  const booking = await createBookingHandler({
    name: "NTR 3 on 3 Wednesdays (Apr 2024)",
    numPlayers: 14,
    location: "NTR Richmond Hill",
    cost: "1333.4",
    scheduledTime: "21:30:00",
    startDate: "2024-04-03",
    endDate: "2024-04-24",
    bookedById: player.id,
  });

  await sendMessage(senderJid, {
    text: stringJoin(`Booking created! 🎉`, JSON.stringify(booking)),
  });
};
