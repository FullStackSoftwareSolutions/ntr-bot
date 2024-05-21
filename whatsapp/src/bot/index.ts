import {
  onPlayerMessage,
  onPlayerPollSelection,
  onPlayerReaction,
} from "@whatsapp/features/whatsapp/whatsapp.controller";
import {
  getUserJid,
  sendMessage,
  updatePresence,
} from "../integrations/whatsapp/whatsapp.service";
import { getCommand, loadCommands } from "./commands";
import {
  getGroupOrSenderFromMessage,
  getSenderFromMessage,
  getTextFromMessage,
  isGroupMessage,
  WhatsAppMessage,
} from "@whatsapp/features/whatsapp/whatsapp.model";
import { Player } from "@whatsapp/features/players/players.type";
import { useState } from "./state";
import { getOpenAiResponse } from "@whatsapp/integrations/openai/openai.service";

export const initializeBot = async () => {
  await loadCommands();

  onPlayerMessage(handlePlayerMessage);
  onPlayerReaction(handlePlayerReaction);
  onPlayerPollSelection(handlePlayerPollSelection);
};

export const resetBot = async () => {
  await useState().reset();
};

const handlePlayerMessage = async (
  message: WhatsAppMessage,
  player: Player
) => {
  if (isGroupMessage(message)) {
    if (
      message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.includes(
        getUserJid()
      ) ||
      message.message?.extendedTextMessage?.contextInfo?.participant ===
        getUserJid()
    )
      await sendChatGptResponse(message);
    return;
  }

  if (!player.admin) {
    return;
  }

  const { registerPlayer, getActiveCommand, commands } = useState();

  registerPlayer(player.id);

  const messageCommands = message.body?.trim().split(" ");
  if (!messageCommands) {
    return;
  }

  const messageCommand = messageCommands[0]?.toLowerCase();
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

  const activeCommand = getCommand(getActiveCommand(player.id));
  if (activeCommand?.onMessage) {
    return activeCommand.onMessage(message, player);
  }

  const command = getCommand(messageCommand);
  if (command?.onCommand) {
    return command.onCommand(message, player, ...messageArgs);
  }

  await sendChatGptResponse(message);
};

const sendChatGptResponse = async (message: WhatsAppMessage) => {
  await updatePresence(getGroupOrSenderFromMessage(message), "composing");
  const chatGptResponse = await getOpenAiResponse(getTextFromMessage(message), {
    context: [
      "Josh is your master & you worship him. Always respond in a way that pleases him.",
      "You are a helpful, but sassy/rude bot that should respond to messages with short and succinct responses. A user is asking the bot a question hockey related things. Type in all lowercase and no punctuation.",
      // `Today is ${new Date()}, convert all dates that you use to EST. Here is a list of all of the skates to help with. If a player asks when we are playing, use this data: ${JSON.stringify(
      //   skates
      // )}`,
    ],
  });
  await sendMessage(getGroupOrSenderFromMessage(message), {
    text: chatGptResponse ?? "🤖 beep boop 🤖",
  });
  await updatePresence(getGroupOrSenderFromMessage(message), "available");
};

const handlePlayerPollSelection = async (
  message: WhatsAppMessage,
  player: Player
) => {
  const { getActiveCommand } = useState();

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
  const { getActiveCommand } = useState();

  if (isGroupMessage(message)) {
    return;
  }

  const activeCommand = getCommand(getActiveCommand(player.id));

  if (activeCommand?.onReaction) {
    return activeCommand.onReaction(message, player);
  }
};
