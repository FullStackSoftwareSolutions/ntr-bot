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
  PollMessageOptions,
  fetchLatestBaileysVersion,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import pino from "pino";
import { WhatsAppMessage } from "~/features/whatsapp/whatsapp.model";
import { unlinkSync } from "fs";
import { generateRefProvider } from "./hash";
import path from "path";
import chalk from "chalk";
import EventEmitter from "node:events";

export type TextMessage = {
  key: WAProto.IMessageKey;
  senderJid: string;
  message: string | null | undefined;
};

const storePath = path.resolve(`./state/store.json`);

let sock: ReturnType<typeof makeWASocket>;
let authState: AuthenticationState;
let saveCreds: () => Promise<void>;
let store: ReturnType<typeof makeInMemoryStore>;

const eventEmitter = new EventEmitter();

export const initialize = async (auth: {
  state: AuthenticationState;
  saveCreds: () => Promise<void>;
}) => {
  store = makeInMemoryStore({ logger });
  store.readFromFile(storePath);
  saveStoreAutomatically();

  authState = auth.state;
  saveCreds = auth.saveCreds;

  const { version, isLatest } = await fetchLatestBaileysVersion();
  console.log(`using WA v${version.join(".")}, isLatest: ${isLatest}`);

  return connect();
};

const logger = pino({ level: "silent" }) as any;

export const connect = async () => {
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
  // sock.ev.process(
  //   // events is a map for event name => event data
  //   async (events) => {
  //     console.log(events);
  //   }
  // );

  store.bind(sock.ev);

  sock.ev.on("creds.update", saveCreds);
  sock.ev.on("connection.update", handleConnectionUpdate);
  sock.ev.on("messages.upsert", handleMessagesUpsert);
  sock.ev.on("messages.update", handleMessagesUpdate);
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
    store.writeToFile(storePath);
  }, 1_000);
};

const handleConnectionUpdate = (update: Partial<ConnectionState>) => {
  const { connection, lastDisconnect } = update;
  const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;

  if (connection === "close") {
    if (statusCode !== DisconnectReason.loggedOut) {
      console.info(chalk.black(chalk.bgRed(" ❌ Whatsapp connection closed")));

      connect();
    }

    if (statusCode === DisconnectReason.loggedOut) {
      console.info(chalk.black(chalk.bgRed(" 🪵 Whatsapp logged out")));
      unlinkSync(storePath);

      connect();
    }
  } else if (connection === "open") {
    console.info(chalk.black(chalk.bgGreen(" 🛜 Whatsapp connection open ")));
  }
};

const handleMessagesUpsert = async ({ messages, ...rest }: any) => {
  if (rest.type !== "notify") return;
  const [message] = messages;

  if (
    !message ||
    message?.message?.protocolMessage?.type ===
      WAProto.Message.ProtocolMessage.Type.EPHEMERAL_SETTING
  ) {
    return;
  }

  let type: string = "message";
  const messageText =
    message?.message?.extendedTextMessage?.text ??
    message?.message?.conversation;

  let payload = {
    ...message,
    type,
    body: messageText,
    from: message?.key?.remoteJid,
  };

  if (message.message?.reactionMessage) {
    type = "reaction";
    payload = {
      ...payload,
      type: "reaction",
      body: message?.message?.reactionMessage?.text,
      reactionMessage: message?.message?.reactionMessage,
    };
  }

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

  const btnCtx = payload?.message?.buttonsResponseMessage?.selectedDisplayText;
  if (btnCtx) payload.body = btnCtx;

  const listRowId = payload?.message?.listResponseMessage?.title;
  if (listRowId) payload.body = listRowId;

  if (payload.type === "message") {
    eventEmitter.emit("message", payload);
  }
  if (payload.type === "reaction") {
    eventEmitter.emit("reaction", payload);
  }
};

const handleMessagesUpdate = async (message: any) => {
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

        const pollVotesForSender = pollMessage
          .filter((poll) => poll.voters.includes(key.remoteJid!))
          .map((poll) => poll.name);

        const body = pollMessage
          .filter((poll) => poll.voters.length > 0)
          .map((poll) => poll.name)
          .join(", ");

        let payload = {
          ...messageCtx,
          body: body,
          pollVotesForSender,
          pollMessage,
          from: key.remoteJid,
          pushName: messageOriginal?.pushName,
          broadcast: messageOriginal?.broadcast,
          messageTimestamp: messageOriginal?.messageTimestamp,
          voters: pollCreation,
          type: "poll",
        };

        eventEmitter.emit("pollSelection", payload);
      }
    }
  }
};

export const onMessage = (cb: (message: WhatsAppMessage) => void) => {
  eventEmitter.on("message", cb);
};

export const onReaction = (cb: (message: WhatsAppMessage) => void) => {
  eventEmitter.on("reaction", cb);
};

export const onPollSelection = (cb: (message: WhatsAppMessage) => void) => {
  eventEmitter.on("pollSelection", cb);
};

export const sendMessage = (
  toJid: string,
  message: AnyMessageContent,
  options?: MiscMessageGenerationOptions
) => {
  return sock.sendMessage(toJid, message, options);
};

const MAX_POLL_OPTIONS = 12;
export const sendPolls = async (toJid: string, poll: PollMessageOptions) => {
  const pollKeys = [];

  for (let i = 0; i < Math.ceil(poll.values.length / MAX_POLL_OPTIONS); i++) {
    const values = poll.values.slice(
      i * MAX_POLL_OPTIONS,
      i * MAX_POLL_OPTIONS + MAX_POLL_OPTIONS
    );

    const pollName = i === 0 ? poll.name : "-------";
    const pollMesage = await sendMessage(toJid, {
      poll: { name: pollName, values, selectableCount: poll.selectableCount },
    });
    if (pollMesage) {
      pollKeys.push(pollMesage);
    }
  }

  return pollKeys;
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
