import { getAllBookings } from "../../features/bookings/bookings.db";
import { sendMessage } from "../../integrations/whatsapp/whatsapp.service";
import {
  formatList,
  formatStringList,
  stringJoin,
} from "../../features/whatsapp/whatsapp.formatting";
import {
  getSenderFromMessage,
  WhatsAppMessage,
} from "~/features/whatsapp/whatsapp.model";
import { Player } from "~/features/players/players.type";
import { getSkateById } from "~/features/skates/skates.db";
import dayjs from "dayjs";
import { getPlayerName } from "~/features/players/players.model";
import { timeToEmoji } from "~/formatting/time.emoji";

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

  const skateFormat = formatStringList(
    skate.playersToSkates.map((p) => getPlayerName(p.player)),
    {
      header: {
        content: `🏒 *${skate.booking!.announceName}* ${timeToEmoji(
          skate.scheduledOn
        )} ${dayjs(skate.scheduledOn).format(`MMM D h:mma`)}`,
      },
    }
  );

  await sendMessage(senderJid, {
    text: skateFormat,
  });
};

const getSkate = async (skateId: number | null | undefined) => {
  if (!skateId) {
    return null;
  }
  return await getSkateById(skateId);
};
