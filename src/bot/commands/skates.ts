import { sendMessage } from "../../integrations/whatsapp/whatsapp.service";
import {
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
import {
  getPlayerName,
  getPlayerSkillLevel,
} from "~/features/players/players.model";
import { timeToEmoji } from "~/formatting/time.emoji";
import {
  getSkateTimeMessage,
  randomizeTeamsForSkate,
  Teams,
} from "~/features/skates/skates.model";

export const onCommand = async (
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

  const teams = randomizeTeamsForSkate(skate);

  const teamBlack = formatStringList(
    teams[Teams.Black].map(
      (p) => `[${getPlayerSkillLevel(p)}] ${getPlayerName(p)}`
    ),
    {
      header: {
        content: Teams.Black,
      },
    }
  );
  const teamWhite = formatStringList(
    teams[Teams.White].map(
      (p) => `[${getPlayerSkillLevel(p)}] ${getPlayerName(p)}`
    ),
    {
      header: {
        content: Teams.White,
      },
    }
  );
  const header = `🏒 *${skate.booking!.announceName}* ${getSkateTimeMessage(
    skate
  )}`;

  const skateFormat = stringJoin(header, "", teamBlack, "", teamWhite);

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
