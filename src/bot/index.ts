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
import { usePlayerStore } from "./state";

export const initializeBot = async () => {
  await loadCommands();
  onAdminMessage(handleAdminMessage);
};

const handleAdminMessage = async (message: WhatsAppMessage, player: Player) => {
  const {
    registerPlayer,
    getActiveCommand,
    setActiveCommand,
    clearActiveCommand,
  } = usePlayerStore();

  registerPlayer(player.id);

  const commandMessage = message.body?.trim().toLowerCase();
  const jid = getGroupOrSenderFromMessage(message);

  if (!isGroupMessage(message)) {
    const activeCommand = getActiveCommand(player.id);
    if (activeCommand) {
      const command = commands.get(activeCommand);
      return command.execute(message, player);
    }

    const command = commandMessage && commands.get(commandMessage);
    if (command) {
      if (command.onComplete) {
        setActiveCommand(player.id, commandMessage);
        command.onComplete(() => {
          clearActiveCommand(player.id);
        });
      }
      return command.execute(message, player);
    }
  }

  await sendMessage(jid, {
    text: "🤖 beep boop 🤖 i dunno that one...",
  });
};
