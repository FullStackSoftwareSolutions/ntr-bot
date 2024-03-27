import { sendMessage } from "../../integrations/whatsapp/whatsapp.service";
import EventEmitter from "node:events";
import {
  getSenderFromMessage,
  WhatsAppMessage,
} from "~/features/whatsapp/whatsapp.model";
import { Player } from "~/features/players/players.type";
import { getAllBookings } from "~/features/bookings/bookings.db";

export const execute = async (message: WhatsAppMessage, player: Player) => {
  const senderJid = getSenderFromMessage(message);

  console.log(JSON.stringify(message, null, 2));

  const bookings = await getAllBookings();

  await sendMessage(senderJid, {
    poll: {
      name: "Which booking would you like to view?",
      values: bookings.map((booking) => `(${booking.id}) ${booking.name}`),
      selectableCount: 1,
    },
  });
};

const commandEventEmitter = new EventEmitter();
const completed = async () => {
  // await sendMessage(senderJid, {
  //   text: "Booking created! 🎉",
  // });

  commandEventEmitter.emit("complete");
};

export const onComplete = (cb: () => void) => {
  commandEventEmitter.on("complete", cb);
};
