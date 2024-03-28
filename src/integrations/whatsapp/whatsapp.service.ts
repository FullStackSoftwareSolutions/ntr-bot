import {
  makeWASocket,
  DisconnectReason,
  AuthenticationState,
  ConnectionState,
  AnyMessageContent,
  MiscMessageGenerationOptions,
  WAProto,
  getAggregateVotesInPollMessage,
  makeCacheableSignalKeyStore,
  makeInMemoryStore,
  WAMessageKey,
  WAMessageContent,
  GroupMetadata,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import pino from "pino";
import { WhatsAppMessage } from "~/features/whatsapp/whatsapp.model";
import { unlinkSync } from "fs";
import { generateRefProvider } from "./hash";
import path from "path";

let sock: ReturnType<typeof makeWASocket>;
let authState: AuthenticationState;
let saveCreds: () => Promise<void>;
let store: ReturnType<typeof makeInMemoryStore>;

export const initialize = async (auth: {
  state: AuthenticationState;
  saveCreds: () => Promise<void>;
}) => {
  authState = auth.state;
  saveCreds = auth.saveCreds;

  return connect();
};

const logger = pino({ level: "fatal" }) as any;

export const connect = async () => {
  store = makeInMemoryStore({ logger });
  store.readFromFile(path.resolve(`./store.json`));

  saveStoreAutomatically();

  sock = makeWASocket({
    printQRInTerminal: true,
    auth: {
      creds: authState.creds,
      keys: makeCacheableSignalKeyStore(authState.keys, logger),
    },
    logger: logger,
    browser: ["NTR Bot", "", ""],
    syncFullHistory: false,
    generateHighQualityLinkPreview: true,
    getMessage,
  });
  store.bind(sock.ev);

  sock.ev.on("creds.update", saveCreds);
  sock.ev.on("connection.update", handleConnectionUpdate);
};

async function getMessage(
  key: WAMessageKey
): Promise<WAMessageContent | undefined> {
  if (store) {
    const msg = await store.loadMessage(key.remoteJid!, key.id!);
    return msg?.message || undefined;
  }

  // only if store is present
  return WAProto.Message.fromObject({});
}

const saveStoreAutomatically = () => {
  setInterval(() => {
    const storePath = path.resolve(`./store.json`);
    store.writeToFile(storePath);
  }, 10_000);
};

const handleConnectionUpdate = (update: Partial<ConnectionState>) => {
  const { connection, lastDisconnect } = update;
  const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;

  if (connection === "close") {
    if (statusCode !== DisconnectReason.loggedOut) {
      connect();
    }

    if (statusCode === DisconnectReason.loggedOut) {
      unlinkSync("store.json");

      connect();
    }
  } else if (connection === "open") {
    console.info("Whatsapp connection open");
    console.info("-------------------------------------------");
  }
};

export type TextMessage = {
  key: WAProto.IMessageKey;
  senderJid: string;
  message: string | null | undefined;
};

export const onMessage = (cb: (message: WhatsAppMessage) => void) => {
  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;
    const [message] = messages;

    if (
      !message ||
      message?.message?.protocolMessage?.type ===
        WAProto.Message.ProtocolMessage.Type.EPHEMERAL_SETTING
    ) {
      return;
    }

    let payload = {
      ...message,
      type,
      body:
        message?.message?.extendedTextMessage?.text ??
        message?.message?.conversation,

      from: message?.key?.remoteJid,
    };

    if (message.message?.locationMessage) {
      const { degreesLatitude, degreesLongitude } =
        message.message.locationMessage;
      if (
        typeof degreesLatitude === "number" &&
        typeof degreesLongitude === "number"
      ) {
        payload = { ...payload, body: generateRefProvider("_event_location_") };
      }
    }

    //Detectar video
    if (message.message?.videoMessage) {
      payload = { ...payload, body: generateRefProvider("_event_media_") };
    }

    //Detectar Sticker
    if (message.message?.stickerMessage) {
      payload = { ...payload, body: generateRefProvider("_event_media_") };
    }

    //Detectar media
    if (message.message?.imageMessage) {
      payload = { ...payload, body: generateRefProvider("_event_media_") };
    }

    //Detectar file
    if (message.message?.documentMessage) {
      payload = { ...payload, body: generateRefProvider("_event_document_") };
    }

    //Detectar voice note
    if (message.message?.audioMessage) {
      payload = { ...payload, body: generateRefProvider("_event_voice_note_") };
    }

    if (payload.from === "status@broadcast") return;

    if (payload?.key?.fromMe) return;

    if (!payload.body) return;

    // if (!baileyIsValidNumber(payload.from)) {
    //   return;
    // }

    const btnCtx =
      payload?.message?.buttonsResponseMessage?.selectedDisplayText;
    if (btnCtx) payload.body = btnCtx;

    const listRowId = payload?.message?.listResponseMessage?.title;
    if (listRowId) payload.body = listRowId;

    cb(payload);
  });

  sock.ev.on("messages.update", async (message) => {
    for (const { key, update } of message) {
      if (update.pollUpdates) {
        const pollCreation = await getMessage(key);
        if (pollCreation) {
          const pollMessage = await getAggregateVotesInPollMessage({
            message: pollCreation,
            pollUpdates: update.pollUpdates,
          });
          const [messageCtx] = message;

          const messageOriginalKey =
            messageCtx?.update?.pollUpdates?.[0]?.pollUpdateMessageKey;
          if (!messageOriginalKey?.id || !messageOriginalKey.remoteJid) return;

          const messageOriginal = await store.loadMessage(
            messageOriginalKey.remoteJid,
            messageOriginalKey.id
          );

          let payload = {
            ...messageCtx,
            body:
              pollMessage.find((poll) => poll.voters.length > 0)?.name || "",
            from: key.remoteJid,
            pushName: messageOriginal?.pushName,
            broadcast: messageOriginal?.broadcast,
            messageTimestamp: messageOriginal?.messageTimestamp,
            voters: pollCreation,
            type: "poll",
          };

          cb(payload);
        }
      }
    }
  });
};

export const sendMessage = (
  toJid: string,
  message: AnyMessageContent,
  options?: MiscMessageGenerationOptions
) => {
  return sock.sendMessage(toJid, message, options);
};

export const deleteMessage = (jid: string, messageKey: WAMessageKey) => {
  return sendMessage(jid, { delete: messageKey });
};

export const getAllGroups = async (): Promise<GroupMetadata[]> => {
  const getGroups = await sock.groupFetchAllParticipating();
  return Object.entries(getGroups)
    .slice(0)
    .map((entry) => entry[1]);
};
