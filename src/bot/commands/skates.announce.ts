import { getAllBookings } from "../../features/bookings/bookings.db";
import { sendMessage } from "../../integrations/whatsapp/whatsapp.service";
import {
  formatList,
  stringJoin,
} from "../../features/whatsapp/whatsapp.formatting";
import {
  getSenderFromMessage,
  WhatsAppMessage,
} from "~/features/whatsapp/whatsapp.model";
import { Player } from "~/features/players/players.type";
import { getSkateById } from "~/features/skates/skates.db";
import dayjs from "dayjs";

export const execute = async (
  message: WhatsAppMessage,
  sessionPlayer: Player,
  skateId: number
) => {
  const skate = await getSkate(skateId);
  const senderJid = getSenderFromMessage(message);

  if (!skate) {
    sendMessage(senderJid, { text: "⛸️ *No skate found*" });
    return;
  }

  // console.log(skate.players);
  // const skateFormat = formatList([skate.players], {
  //   header: {
  //     content: `⛸️ *${skate.booking!.announceName}* 📅 ${dayjs(
  //       skate.scheduledOn
  //     ).format("MMM D ⌚ h:mma")}`,
  //   },
  // });

  // await sendMessage(senderJid, {
  //   text: skateFormat,
  // });

  // if (skate.booking?.whatsAppGroupJid) {
  //   await sendMessage(skate.booking?.whatsAppGroupJid, {
  //     text: skateFormat,
  //   });

  //   await sendMessage(senderJid, {
  //     text: `📢 Announced skate to group ${skate.booking?.whatsAppGroupJid}`,
  //   });
  // }
};

const getSkate = async (skateId: number | null | undefined) => {
  if (!skateId) {
    return null;
  }
  return await getSkateById(skateId);
};
