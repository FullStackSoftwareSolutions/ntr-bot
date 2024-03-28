import {
  AnyMessageContent,
  MiscMessageGenerationOptions,
  WAProto,
} from "@whiskeysockets/baileys";

export type WhatsAppMessageKey = WAProto.IMessageKey;

export type WhatsAppMessage = {
  from: string | null | undefined;
  message?: WAProto.IWebMessageInfo["message"] | null | undefined;
  key?: WhatsAppMessageKey | undefined;
  type: string;
  body?: string | null | undefined;
};
export type WhatsAppMessageContent = AnyMessageContent;
export type WhatsAppMessageOptions = MiscMessageGenerationOptions;

export const getNumberFromJid = (jid: string) => jid.split("@")[0] as string;

export const getTextFromMessage = (message: WhatsAppMessage): string => {
  return message.message?.conversation !== ""
    ? message.message?.conversation!
    : message.message?.extendedTextMessage?.text!;
};
export const getSenderNumberFromMessage = (message: WhatsAppMessage) =>
  getNumberFromJid(getSenderFromMessage(message));

export const getGroupOrSenderFromMessage = (message: WhatsAppMessage) =>
  message.key?.remoteJid!;
export const getSenderFromMessage = (message: WhatsAppMessage) =>
  message.key?.participant ?? message.key!.remoteJid!;

export const isGroupMessage = (message: WhatsAppMessage) =>
  message.key?.participant != null;

export const isPollResponse = (message: WhatsAppMessage) =>
  message.type === "poll" && message.body != null;

export const doKeysMatch = (
  keya: WhatsAppMessageKey | null | undefined,
  keyb: WhatsAppMessageKey | null | undefined
) => {
  if (!keya || !keyb) return false;

  return keya.id === keyb.id && keya.remoteJid === keyb.remoteJid;
};

export const isPollAnswer = (
  message: WhatsAppMessage,
  pollKey: WhatsAppMessageKey | null | undefined
) => {
  if (!isPollResponse(message)) return false;

  return doKeysMatch(message.key, pollKey);
};
