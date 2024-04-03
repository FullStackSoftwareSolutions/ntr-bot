import {
  onPlayerMessage,
  onPlayerPollSelection,
  onPlayerReaction,
} from "~/features/whatsapp/whatsapp.controller";
import { sendMessage } from "../integrations/whatsapp/whatsapp.service";
import { getCommand, loadCommands } from "./commands";
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

  onPlayerMessage(handlePlayerMessage);
  onPlayerReaction(handlePlayerReaction);
  onPlayerPollSelection(handlePlayerPollSelection);
};

export const resetBot = async () => {
  await usePlayerStore().reset();
};

const handlePlayerMessage = async (
  message: WhatsAppMessage,
  player: Player
) => {
  const {
    registerPlayer,
    getActiveCommand,
    setActiveCommand,
    clearActiveCommand,
    reset,
    commands,
  } = usePlayerStore();

  registerPlayer(player.id);

  const messageCommands = message.body?.trim().toLowerCase().split(" ");
  if (!messageCommands) {
    return;
  }

  const messageCommand = messageCommands[0];
  const messageArgs = messageCommands.slice(1);
  if (!messageCommand) {
    return;
  }

  if (messageCommand === "!reset") {
    await sendMessage(getSenderFromMessage(message), {
      text: "⚠️⚠️⚠️ 🤖 beep boop 🤖 RESET!",
    });
    return resetBot();
  }
  if (messageCommand === "!state.all") {
    await sendMessage(getSenderFromMessage(message), {
      text: JSON.stringify(commands, null, 2),
    });
    return;
  }
  if (messageCommand === "!state") {
    await sendMessage(getSenderFromMessage(message), {
      text: JSON.stringify(commands[player.id], null, 2),
    });
    return;
  }

  const jid = getGroupOrSenderFromMessage(message);

  if (!isGroupMessage(message)) {
    const activeCommand = getCommand(getActiveCommand(player.id));
    if (activeCommand?.onMessage) {
      return activeCommand.onMessage(message, player);
    }

    // TODO: DELETE THIS
    if (activeCommand?.execute) {
      return activeCommand.execute(message, player);
    }

    const command = getCommand(messageCommand);
    if (command?.onCommand) {
      return command.onCommand(message, player, ...messageArgs);
    }

    /// TODO: DELETE THIS
    if (command?.onComplete) {
      setActiveCommand(player.id, messageCommand);
      command.onComplete(() => {
        clearActiveCommand(player.id);
      });
    }

    // TODO: DELET THIS
    return command?.execute(message, player, ...messageArgs);
  }

  await sendMessage(jid, {
    text: "ayda eats poop 💩",
  });
};

const handlePlayerPollSelection = async (
  message: WhatsAppMessage,
  player: Player
) => {
  const { getActiveCommand } = usePlayerStore();

  if (isGroupMessage(message)) {
    return;
  }

  const activeCommand = getCommand(getActiveCommand(player.id));

  if (activeCommand?.onPollSelection) {
    return activeCommand.onPollSelection(message, player);
  }
};

const handlePlayerReaction = async (
  message: WhatsAppMessage,
  player: Player
) => {
  const { getActiveCommand } = usePlayerStore();

  if (isGroupMessage(message)) {
    return;
  }

  const activeCommand = getCommand(getActiveCommand(player.id));

  if (activeCommand?.onReaction) {
    return activeCommand.onReaction(message, player);
  }
};
