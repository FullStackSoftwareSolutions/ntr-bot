import { onAdminMessage } from "~/features/whatsapp/whatsapp.controller";
import { sendMessage } from "../integrations/whatsapp/whatsapp.service";
import { commands, loadCommands } from "./commands";
import {
  getGroupOrSenderFromMessage,
  getTextFromMessage,
  isGroupMessage,
  WhatsAppMessage,
} from "~/features/whatsapp/whatsapp.model";
import { Player } from "~/features/players/players.type";

export const initializeBot = async () => {
  await loadCommands();
  onAdminMessage(handleAdminMessage);
};

const activeCommandByPlayer: {
  [playerId: number]: string;
} = {};

const handleAdminMessage = async (message: WhatsAppMessage, player: Player) => {
  const messageContent = getTextFromMessage(message);
  const jid = getGroupOrSenderFromMessage(message);

  if (!isGroupMessage(message)) {
    const activeCommand = activeCommandByPlayer[player.id];
    if (activeCommand) {
      const command = commands.get(activeCommand);
      return command.execute(message, player);
    }

    const command = messageContent && commands.get(messageContent);
    if (command) {
      if (command.onComplete) {
        activeCommandByPlayer[player.id] = messageContent;
        command.onComplete(() => {
          delete activeCommandByPlayer[player.id];
        });
      }
      return command.execute(message, player);
    }
  }

  await sendMessage(jid, {
    text: "🤖 beep boop 🤖 i dunno that one...",
  });
};
