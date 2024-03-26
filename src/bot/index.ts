import {
  type Message,
  onMessage,
  sendMessage,
} from "../integrations/whatsapp/whatsapp.service";
import path from "path";
import { Command } from "./commands";

export const initializeBot = async () => {
  await loadCommands();
  onMessage(handleMessage);
};

const commands = new Map<string, any>();
const loadCommands = async () => {
  for (const command of Object.values(Command)) {
    const filePath = `./${path.join("commands", command)}`;
    const commandImport = await import(filePath);

    if ("execute" in commandImport) {
      commands.set(command, commandImport);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing the required "execute" property.`
      );
    }
  }
};

const handleMessage = ({ senderJid, message }: Message) => {
  console.log("received message", { senderJid, message });

  const command = message && commands.get(message);
  if (command) {
    return command.execute(senderJid);
  }

  sendMessage(senderJid, "Command not found");
};
