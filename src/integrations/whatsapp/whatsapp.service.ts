import {
  makeWASocket,
  DisconnectReason,
  AuthenticationState,
  ConnectionState,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import pino from "pino";

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
  //enabled: false,
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

export type Message = {
  senderJid: string;
  message: string | null | undefined;
};
export const onMessage = (cb: (message: Message) => void) => {
  sock.ev.on("messages.upsert", (m) => {
    const message = m.messages[0];
    if (!message) return;

    const senderJid = message.key.remoteJid;
    const fromMe = message.key.fromMe;

    if (fromMe || !senderJid) return;

    cb({
      senderJid,
      message:
        message.message?.conversation !== ""
          ? message.message?.conversation
          : message.message?.extendedTextMessage?.text,
    });
  });
};

export const sendMessage = (toJid: string, message: string) => {
  return sock.sendMessage(toJid, { text: message });
};
