import { useWhatsappAuth } from "../../integrations/whatsapp/whatsapp.auth";
import {
  initialize,
  sendMessage as sendWhatsappMessage,
  type TextMessage,
} from "../../integrations/whatsapp/whatsapp.service";
import {
  deleteWhatsappAuthData,
  getWhatsappAuthData,
  upsertWhatsappAuthData,
} from "./whatsapp.db";
import { onMessage as onWhatsAppMessage } from "../../integrations/whatsapp/whatsapp.service";
import { getPlayerByPhoneNumber } from "../players/players.db";
import {
  getNumberFromJid,
  getSenderFromMessage,
  getSenderNumberFromMessage,
  WhatsAppMessage,
  WhatsAppMessageContent,
  WhatsAppMessageOptions,
} from "./whatsapp.model";
import { WAProto } from "@whiskeysockets/baileys";

export const connectToWhatsapp = async () => {
  const auth = await useWhatsappAuth({
    deleteData: deleteWhatsappAuthData,
    writeData: upsertWhatsappAuthData,
    readData: getWhatsappAuthData,
  });

  await initialize(auth);

  onWhatsAppMessage(handleMessage);
};

const handleMessage = async (message: WhatsAppMessage) => {
  const player = await getPlayerByPhoneNumber(
    getSenderNumberFromMessage(message)
  );
  console.log(player);

  if (!player) {
    await sendMessage(
      getSenderFromMessage(message),
      { text: "who the fuck are you?" },
      {
        quoted: message,
      }
    );
    return;
  }

  if (player.admin) {
    await onAdminMessage(message);
    return;
  }

  await onPlayerMessage(message);
};

const onAdminMessage = async (message: WhatsAppMessage) => {
  await sendMessage(getSenderFromMessage(message), { text: "admin" });
};

const onPlayerMessage = async (message: WhatsAppMessage) => {
  await sendMessage(getSenderFromMessage(message), { text: "player" });
};

export const sendMessage = (
  toJid: string,
  message: WhatsAppMessageContent,
  options?: WhatsAppMessageOptions
) => sendWhatsappMessage(toJid, message, options);
