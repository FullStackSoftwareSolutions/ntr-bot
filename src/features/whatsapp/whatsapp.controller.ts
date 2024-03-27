import { useWhatsappAuth } from "../../integrations/whatsapp/whatsapp.auth";
import {
  initialize,
  sendMessage as sendWhatsappMessage,
} from "../../integrations/whatsapp/whatsapp.service";
import {
  deleteWhatsappAuthData,
  getWhatsappAuthData,
  upsertWhatsappAuthData,
} from "./whatsapp.db";
import { onMessage as onWhatsAppMessage } from "../../integrations/whatsapp/whatsapp.service";
import { getPlayerByPhoneNumber } from "../players/players.db";
import {
  getGroupOrSenderFromMessage,
  getSenderFromMessage,
  getSenderNumberFromMessage,
  WhatsAppMessage,
  WhatsAppMessageContent,
  WhatsAppMessageOptions,
} from "./whatsapp.model";
import EventEmitter from "node:events";
import { Player } from "../players/players.type";

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

  if (!player) {
    await sendMessage(getGroupOrSenderFromMessage(message), {
      text: "who the fuck are you?",
    });
    return;
  }

  if (player.admin) {
    await handleAdminMessage(message, player);
    return;
  }

  await handlePlayerMessage(message, player);
};

const handleAdminMessage = async (message: WhatsAppMessage, player: Player) => {
  messageEventEmitter.emit("admin-message", message, player);
};
const handlePlayerMessage = async (
  message: WhatsAppMessage,
  player: Player
) => {
  messageEventEmitter.emit("player-message", message, player);
};

const messageEventEmitter = new EventEmitter();

export const onAdminMessage = (
  cb: (message: WhatsAppMessage, player: Player) => void
) => {
  messageEventEmitter.on("admin-message", cb);
};
export const onPlayerMessage = (
  cb: (message: WhatsAppMessage, player: Player) => void
) => {
  messageEventEmitter.on("player-message", cb);
};

export const sendMessage = (
  toJid: string,
  message: WhatsAppMessageContent,
  options?: WhatsAppMessageOptions
) => sendWhatsappMessage(toJid, message, options);
