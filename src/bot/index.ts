import {
  type TextMessage,
  onMessage,
  sendMessage,
} from "../integrations/whatsapp/whatsapp.service";
import { commands, loadCommands } from "./commands";
import { execute as helpCommand } from "./commands/help";

export const initializeBot = async () => {
  await loadCommands();
  //onMessage(handleMessage);
};

const handleMessage = async ({ senderJid, message }: TextMessage) => {
  console.log("received message", { senderJid, message });

  const command = message && commands.get(message);
  if (command) {
    return command.execute(senderJid);
  }

  await sendMessage(senderJid, {
    text: "🤖 beep boop 🤖 i dunno that one... try one of these",
  });
  await helpCommand(senderJid);
};
