import { Player, PlayerCreate } from "~/features/players/players.type";
import { sendMessage } from "../../integrations/whatsapp/whatsapp.service";
import {
  formatList,
  stringJoin,
} from "~/features/whatsapp/whatsapp.formatting";
import EventEmitter from "node:events";
import {
  getSenderFromMessage,
  WhatsAppMessage,
} from "~/features/whatsapp/whatsapp.model";
import { createPlayerHandler } from "~/features/players/players.controller";
import { parseEmail, parsePhoneNumber } from "../inputs";
import { usePlayerStore } from "../state";

export const playerStepPrompt: {
  [key in keyof PlayerCreate]?:
    | string
    | {
        prompt: string;
        required: boolean;
        parse?: (value: string) => any;
      };
} = {
  fullName: "What is their full name?",
  nickname: {
    prompt: "What is their nickname?",
    required: false,
  },
  email: {
    prompt: "What is their email?",
    required: true,
    parse: parseEmail,
  },
  phoneNumber: {
    prompt: "What is their phone number?",
    required: true,
    parse: parsePhoneNumber,
  },
  skillLevel: "What is their skill level?",
};

export const execute = async (
  message: WhatsAppMessage,
  sessionPlayer: Player
) => {
  const { clearActiveCommand, setActiveCommand, updatePlayers, getPlayers } =
    usePlayerStore();
  const senderJid = getSenderFromMessage(message);

  let newPlayer = getPlayers(sessionPlayer.id)?.add.player!;
  if (!newPlayer) {
    newPlayer = {};
    updatePlayers(sessionPlayer.id, (draft) => {
      draft.add.player = newPlayer;
    });
  }

  let currentStep = getPendingStep(newPlayer);
  console.log(currentStep);

  // if (!currentStep) {
  //   completed(message, newPlayer as PlayerCreate);
  //   return;
  // }

  await sendMessage(senderJid, {
    text: getReply(currentStep),
  });
};

const getPendingStep = (player: Partial<PlayerCreate>) => {
  return Object.keys(playerStepPrompt).find(
    (key) => player[key as keyof PlayerCreate] === undefined
  ) as keyof PlayerCreate;
};

export const getPrompt = (
  step: keyof PlayerCreate
): {
  prompt: string;
  required: boolean;
  parse: (value: string) => any;
} => {
  const prompt = playerStepPrompt[step]!;
  let promptData =
    typeof prompt === "string"
      ? {
          prompt,
          required: true,
        }
      : prompt;

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
  if (Object.keys(playerStepPrompt)[0] === currentStep) {
    return stringJoin(
      "⛸️ Let's create a new player.",
      "══════════════════════════════════",
      prompt
    );
  }

  return prompt;
};

const commandEventEmitter = new EventEmitter();
const completed = async (message: WhatsAppMessage, player: PlayerCreate) => {
  const newPlayer = await createPlayerHandler(player);

  const senderJid = getSenderFromMessage(message);
  await sendMessage(senderJid, {
    text: formatList([newPlayer], {
      header: {
        content: "🏒 *Player created*",
      },
    }),
  });

  commandEventEmitter.emit("complete");
};

export const onComplete = (cb: () => void) => {
  commandEventEmitter.on("complete", cb);
};
