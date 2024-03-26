import {
  makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";

let sock: ReturnType<typeof makeWASocket>;

export const connect = async () => {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");
  sock = makeWASocket({ printQRInTerminal: true, auth: state });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      const shouldReconnect =
        (lastDisconnect?.error as Boom)?.output?.statusCode !==
        DisconnectReason.loggedOut;
      console.error(
        "connection closed due to ",
        lastDisconnect?.error,
        ", reconnecting ",
        shouldReconnect
      );

      // reconnect if not logged out
      if (shouldReconnect) {
        connect();
      }
    } else if (connection === "open") {
      console.log("opened connection");
    }
  });
  // sock.ev.on("messages.upsert", async (m) => {
  //   console.log(JSON.stringify(m, undefined, 2));

  //   const message = m.messages[0];
  //   const senderId = message.key.remoteJid;
  //   const fromMe = message.key.fromMe;

  //   if (fromMe) return;

  //   console.log("replying to");

  //   await sock.sendMessage(senderId!, {
  //     text: message.message?.conversation || "what was that?",
  //   });
  // });
};

export type Message = {
  senderJid: string;
  message: string | null | undefined;
};
export const onMessage = (cb: (message: Message) => void) => {
  sock.ev.on("messages.upsert", (m) => {
    const message = m.messages[0];
    const senderJid = message.key.remoteJid;
    const fromMe = message.key.fromMe;

    if (fromMe || !senderJid) return;

    cb({
      senderJid,
      message: message.message?.conversation,
    });
  });
};

export const sendMessage = (toJid: string, message: string) => {
  return sock.sendMessage(toJid, { text: message });
};
