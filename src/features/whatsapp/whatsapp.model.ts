import {
  AnyMessageContent,
  MiscMessageGenerationOptions,
  WAProto,
} from "@whiskeysockets/baileys";

export type WhatsAppMessage = WAProto.IWebMessageInfo;
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
  message.key.remoteJid!;
export const getSenderFromMessage = (message: WhatsAppMessage) =>
  message.key.participant ?? message.key.remoteJid!;

export const isGroupMessage = (message: WhatsAppMessage) =>
  message.key.participant != null;
