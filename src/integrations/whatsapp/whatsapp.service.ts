import {
  makeWASocket,
  DisconnectReason,
  AuthenticationState,
  ConnectionState,
  AnyMessageContent,
  MiscMessageGenerationOptions,
  WAProto,
  getAggregateVotesInPollMessage,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import pino from "pino";
import { WhatsAppMessage } from "~/features/whatsapp/whatsapp.model";

let sock: ReturnType<typeof makeWASocket>;
let state: AuthenticationState;
let saveCreds: () => Promise<void>;

export const initialize = async (auth: {
  state: AuthenticationState;
  saveCreds: () => Promise<void>;
}) => {
  state = auth.state;
  saveCreds = auth.saveCreds;

  return connect();
};

const logger = pino({
  enabled: false,
  name: "whatsapp",
}) as any;

export const connect = async () => {
  sock = makeWASocket({
    printQRInTerminal: true,
    auth: state,
    logger: logger,
    browser: ["NTR Bot", "Windows", "10.0.22621"],
    syncFullHistory: true,
  });

  sock.ev.on("creds.update", saveCreds);
  sock.ev.on("connection.update", handleConnectionUpdate);
};

const handleConnectionUpdate = (update: Partial<ConnectionState>) => {
  const { connection, lastDisconnect } = update;
  if (connection === "close") {
    const shouldReconnect =
      (lastDisconnect?.error as Boom)?.output?.statusCode !==
      DisconnectReason.loggedOut;

    // reconnect if not logged out
    if (shouldReconnect) {
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
  sock.ev.on("messages.upsert", (m) => {
    const message = m.messages[0];
    if (!message) return;

    const fromMe = message.key.fromMe;
    if (fromMe) return;

    cb(message);
  });

  // sock.ev.on("messages.update", async (m) => {
  //   for (const { key, update } of m) {
  //     if (update.pollUpdates) {
  //       const pollCreation = await this.getMessage(key);
  //       if (pollCreation) {
  //         const pollMessage = await getAggregateVotesInPollMessage({
  //           message: pollCreation,
  //           pollUpdates: update.pollUpdates,
  //         });
  //         const [messageCtx] = message;

  //         let payload = {
  //           ...messageCtx,
  //           body:
  //             pollMessage.find((poll) => poll.voters.length > 0)?.name || "",
  //           from: utils.formatPhone(key.remoteJid, this.plugin),
  //           voters: pollCreation,
  //           type: "poll",
  //         };
  //       }
  //     }
  //   }
  // });
};

export const sendMessage = (
  toJid: string,
  message: AnyMessageContent,
  options?: MiscMessageGenerationOptions
) => {
  return sock.sendMessage(toJid, message, options);
};
