import {
  AnyMessageContent,
  MiscMessageGenerationOptions,
  WAProto,
} from "@whiskeysockets/baileys";

export type WhatsAppMessageKey = WAProto.IMessageKey;

export type WhatsAppMessage = {
  from: string | null | undefined;
  message?: WAProto.IWebMessageInfo["message"] | null | undefined;
  pollMessage?:
    | {
        name: string;
        voters: string[];
      }[]
    | null
    | undefined;
  pollVotesForSender?: string[] | null | undefined;
  key?: WhatsAppMessageKey | undefined;
  type: string;
  body?: string | null | undefined;
};
export type WhatsAppMessageContent = AnyMessageContent;
export type WhatsAppMessageOptions = MiscMessageGenerationOptions;

export enum PollOptions {
  Confirm = "✅ Confirm",
  Cancel = "❌ Cancel",
  PrevPage = "⬅️ Prev Page",
  NextPage = "➡️ Next Page",
}

export const getNumberFromJid = (jid: string) => jid.split("@")[0] as string;
export const getMentionFromNumber = (number: string) =>
  `@${number.replace("+", "")}`;
export const getJidFromNumber = (number: string) =>
  `${number.replace("+", "")}@s.whatsapp.net`;

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
export const isKeyInList = (
  keyA: WhatsAppMessageKey | null | undefined,
  keys: WhatsAppMessageKey[]
) => {
  if (keys.length === 0 || !keyA) return false;

  return keys.find((key) => doKeysMatch(keyA, key)) !== undefined;
};

export const isPollAnswer = (
  message: WhatsAppMessage,
  pollKey: WhatsAppMessageKey | null | undefined
) => {
  if (!isPollResponse(message)) return false;

  return doKeysMatch(message.key, pollKey);
};
