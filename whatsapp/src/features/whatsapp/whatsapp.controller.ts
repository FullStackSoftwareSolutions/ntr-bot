import { useWhatsappAuth } from "../../integrations/whatsapp/whatsapp.auth";
import {
  initialize,
  sendMessage as sendWhatsappMessage,
} from "../../integrations/whatsapp/whatsapp.service";
import {
  deleteAllWhatsappAuthData,
  deleteWhatsappAuthData,
  getWhatsappAuthData,
  upsertWhatsappAuthData,
} from "@db/features/whatsapp/whatsapp.db";
import {
  onMessage as onWhatsAppMessage,
  onPollSelection as onWhatsAppPollSelection,
  onReaction as onWhatsAppReaction,
  onConnectionUpdate as onWhatsAppConnectionUpdate,
} from "../../integrations/whatsapp/whatsapp.service";
import { getPlayerByPhoneNumber } from "@db/features/players/players.db";
import {
  getGroupOrSenderFromMessage,
  getSenderFromMessage,
  getSenderNumberFromMessage,
  WhatsAppConnection,
  WhatsAppConnectionState,
  WhatsAppMessage,
  WhatsAppMessageContent,
  WhatsAppMessageOptions,
} from "./whatsapp.model";
import EventEmitter from "node:events";
import { Player } from "@db/features/players/players.type";
import chalk from "chalk";
import { DisconnectReason } from "baileys";

let qr: string | null = null;
let connectionStatus: WhatsAppConnection | null = null;

export const connectToWhatsapp = async () => {
  const auth = await useWhatsappAuth({
    resetData: deleteAllWhatsappAuthData,
    deleteData: deleteWhatsappAuthData,
    writeData: upsertWhatsappAuthData,
    readData: getWhatsappAuthData,
  });

  await initialize(auth);

  onWhatsAppMessage(handleMessage);
  onWhatsAppReaction(handleReaction);
  onWhatsAppPollSelection(handlePollSelection);
  onWhatsAppConnectionUpdate(handleConnectionUpdate);
};

const getPlayerFromMessage = async (message: WhatsAppMessage) => {
  const player = await getPlayerByPhoneNumber(
    getSenderNumberFromMessage(message)
  );

  // if (!player) {
  //   await sendMessage(getGroupOrSenderFromMessage(message), {
  //     text: "who the fuck are you?",
  //   });
  //   return;
  // }
  // if (!player.admin) {
  //   await sendMessage(getGroupOrSenderFromMessage(message), {
  //     text: "sorry, admins only",
  //   });
  //   return;
  // }

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
  const sender = getSenderFromMessage(message);
  const group = getGroupOrSenderFromMessage(message);

  let senderMessage = `${chalk.bgBlue(senderJid)}`;
  if (group !== sender) {
    senderMessage = `${chalk.bgBlue(senderJid)} (${group})`;
  }

  console.info(
    `${senderMessage} ${chalk.bgMagenta(message.type)} ${message.body}`
  );

  const player = await getPlayerFromMessage(message);
  if (!player) return;

  messageEventEmitter.emit(PlayerEvents.Message, message, player);
};
const handleReaction = async (message: WhatsAppMessage) => {
  const senderJid = getSenderNumberFromMessage(message);
  console.info(
    `${chalk.bgBlue(senderJid)} ${chalk.bgMagenta(message.type)} ${
      message.body
    }`
  );

  const player = await getPlayerFromMessage(message);
  if (!player) return;

  messageEventEmitter.emit(PlayerEvents.Reaction, message, player);
};
const handlePollSelection = async (message: WhatsAppMessage) => {
  const senderJid = getSenderNumberFromMessage(message);

  console.info(
    `${chalk.bgBlue(senderJid)} ${chalk.bgMagenta(message.type)} ${
      message.body
    }`
  );

  const player = await getPlayerFromMessage(message);
  if (!player) return;

  messageEventEmitter.emit(PlayerEvents.PollSelection, message, player);
};
const handleConnectionUpdate = async (update: WhatsAppConnectionState) => {
  qr = update.qr ?? null;
  connectionStatus = update.connection ?? connectionStatus;

  if (
    connectionStatus === "close" &&
    update.statusCode === DisconnectReason.loggedOut
  ) {
    await deleteAllWhatsappAuthData();
  }
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

export const getConnectionStatus = () => connectionStatus;
export const getQrCode = () => qr;
