import { onAdminMessage } from "~/features/whatsapp/whatsapp.controller";
import { sendMessage } from "../integrations/whatsapp/whatsapp.service";
import { commands, loadCommands } from "./commands";
import {
  getGroupOrSenderFromMessage,
  getSenderFromMessage,
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
    reset,
  } = usePlayerStore();

  registerPlayer(player.id);

  const messageCommands = message.body?.trim().toLowerCase().split(" ");
  if (!messageCommands) {
    return;
  }

  const messageCommand = messageCommands[0];
  if (messageCommand === "!reset") {
    await sendMessage(getSenderFromMessage(message), {
      text: "⚠️⚠️⚠️ 🤖 beep boop 🤖 RESET!",
    });
    return reset();
  }

  const messageArgs = messageCommands.slice(1);

  const jid = getGroupOrSenderFromMessage(message);

  if (!isGroupMessage(message)) {
    const activeCommand = getActiveCommand(player.id);
    if (activeCommand) {
      const command = commands.get(activeCommand);
      return command.execute(message, player);
    }

    const command = messageCommand && commands.get(messageCommand);

    if (command) {
      /// TODO: DELETE THIS
      if (command.onComplete) {
        setActiveCommand(player.id, messageCommand);
        command.onComplete(() => {
          clearActiveCommand(player.id);
        });
      }
      return command.execute(message, player, ...messageArgs);
    }
  }

  await sendMessage(jid, {
    text: "ayda eats poop 💩",
  });
};
