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
import {
  onMessage as onWhatsAppMessage,
  onPollSelection as onWhatsAppPollSelection,
  onReaction as onWhatsAppReaction,
} from "../../integrations/whatsapp/whatsapp.service";
import { getPlayerByPhoneNumber } from "../players/players.db";
import {
  getGroupOrSenderFromMessage,
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
  onWhatsAppReaction(handleReaction);
  onWhatsAppPollSelection(handlePollSelection);
};

const getPlayerOrSendErrorMessages = async (message: WhatsAppMessage) => {
  const player = await getPlayerByPhoneNumber(
    getSenderNumberFromMessage(message)
  );

  if (!player) {
    await sendMessage(getGroupOrSenderFromMessage(message), {
      text: "who the fuck are you?",
    });
    return;
  }
  if (!player.admin) {
    await sendMessage(getGroupOrSenderFromMessage(message), {
      text: "sorry, admins only",
    });
    return;
  }

  return player;
};

export const sendMessage = (
  toJid: string,
  message: WhatsAppMessageContent,
  options?: WhatsAppMessageOptions
) => sendWhatsappMessage(toJid, message, options);

const messageEventEmitter = new EventEmitter();

enum PlayerEvents {
  Message = "message",
  Reaction = "reaction",
  PollSelection = "pollSelection",
}

const handleMessage = async (message: WhatsAppMessage) => {
  const senderJid = getSenderNumberFromMessage(message);
  console.info(`${senderJid}: ${message.body}`);

  const player = await getPlayerOrSendErrorMessages(message);
  if (!player) return;

  messageEventEmitter.emit(PlayerEvents.Message, message, player);
};
const handleReaction = async (message: WhatsAppMessage) => {
  const player = await getPlayerOrSendErrorMessages(message);
  if (!player) return;

  messageEventEmitter.emit(PlayerEvents.Reaction, message, player);
};
const handlePollSelection = async (message: WhatsAppMessage) => {
  const player = await getPlayerOrSendErrorMessages(message);
  if (!player) return;

  messageEventEmitter.emit(PlayerEvents.PollSelection, message, player);
};

export const onPlayerMessage = (
  cb: (message: WhatsAppMessage, player: Player) => void
) => {
  messageEventEmitter.on(PlayerEvents.Message, cb);
};
export const onPlayerReaction = (
  cb: (message: WhatsAppMessage, player: Player) => void
) => {
  messageEventEmitter.on(PlayerEvents.Reaction, cb);
};
export const onPlayerPollSelection = (
  cb: (message: WhatsAppMessage, player: Player) => void
) => {
  messageEventEmitter.on(PlayerEvents.PollSelection, cb);
};
