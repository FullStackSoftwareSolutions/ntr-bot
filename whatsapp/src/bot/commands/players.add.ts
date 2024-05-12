import { Player, PlayerCreate } from "~/features/players/players.type";
import { sendMessage } from "../../integrations/whatsapp/whatsapp.service";
import {
  formatList,
  stringJoin,
} from "~/features/whatsapp/whatsapp.formatting";
import {
  getSenderFromMessage,
  WhatsAppMessage,
} from "~/features/whatsapp/whatsapp.model";
import { createPlayerHandler } from "~/features/players/players.controller";
import { useState } from "../state";
import { Command } from "../commands";
import { playerFieldPrompts } from "~/features/players/players.model";

export const onCommand = async (
  message: WhatsAppMessage,
  sessionPlayer: Player
) => {
  const { setActiveCommand, updatePlayers } = useState();
  setActiveCommand(sessionPlayer.id, Command.PlayersAdd);

  const senderJid = getSenderFromMessage(message);

  updatePlayers(sessionPlayer.id, (draft) => {
    draft.create.player = {};
  });

  const currentStep = getPendingStep({});
  await sendMessage(senderJid, {
    text: getReply(currentStep),
  });
};

export const onMessage = async (
  message: WhatsAppMessage,
  sessionPlayer: Player
) => {
  const { clearActiveCommand, updatePlayers, getPlayers } = useState();

  const senderJid = getSenderFromMessage(message);

  let newPlayer = getPlayers(sessionPlayer.id)?.create.player!;
  let currentStep = getPendingStep(newPlayer);
  const parsedMessage = getPrompt(currentStep)?.parse(message.body!);

  updatePlayers(sessionPlayer.id, (draft) => {
    if (currentStep) {
      draft.create.player![currentStep] = parsedMessage;
    }
  });

  newPlayer = getPlayers(sessionPlayer.id)?.create.player!;
  currentStep = getPendingStep(newPlayer);

  if (!currentStep) {
    await createPlayer(message, newPlayer as PlayerCreate);
    updatePlayers(sessionPlayer.id, (draft) => {
      delete draft.create.player;
    });
    clearActiveCommand(sessionPlayer.id);
    return;
  }

  await sendMessage(senderJid, {
    text: getReply(currentStep),
  });
};

const getPendingStep = (player: Partial<PlayerCreate>) => {
  return Object.keys(playerFieldPrompts).find((key) => {
    const promptData = getPromptData(key as keyof PlayerCreate);
    if (promptData.required) {
      return player[key as keyof PlayerCreate] == null;
    }
    return player[key as keyof PlayerCreate] === undefined;
  }) as keyof PlayerCreate;
};

const getPromptData = (step: keyof PlayerCreate) => {
  const prompt = playerFieldPrompts[step]!;
  return typeof prompt === "string"
    ? {
        prompt,
        required: true,
      }
    : prompt;
};

export const getPrompt = (
  step: keyof PlayerCreate
): {
  prompt: string;
  required: boolean;
  parse: (value: string) => any;
} => {
  const promptData = getPromptData(step);

  if (promptData && !promptData.parse) {
    promptData.parse = (value: string) => {
      if (!promptData.required && value === "!") {
        return null;
      }
      return value;
    };
  }

  return promptData as {
    prompt: string;
    required: boolean;
    parse: (value: string) => any;
  };
};

const getReply = (currentStep: keyof PlayerCreate) => {
  const { prompt } = getPrompt(currentStep);
  if (Object.keys(playerFieldPrompts)[0] === currentStep) {
    return stringJoin(
      "🤕 Let's create a new player.",
      "══════════════════",
      prompt
    );
  }

  return prompt;
};

const createPlayer = async (message: WhatsAppMessage, player: PlayerCreate) => {
  const newPlayer = await createPlayerHandler(player);

  const senderJid = getSenderFromMessage(message);
  await sendMessage(senderJid, {
    text: formatList([newPlayer], {
      header: {
        content: "🤕 *Player created*",
      },
    }),
  });
};
