import { getPlayerById, updatePlayer } from "../../features/players/players.db";
import {
  deleteMessage,
  sendMessage,
} from "../../integrations/whatsapp/whatsapp.service";
import {
  formatList,
  titleCase,
} from "../../features/whatsapp/whatsapp.formatting";
import {
  getSenderFromMessage,
  isPollAnswer,
  WhatsAppMessage,
} from "~/features/whatsapp/whatsapp.model";
import { usePlayerStore } from "../state";
import { Player, PlayerCreate } from "~/features/players/players.type";
import { Command } from "../commands";
import { getPrompt, playerStepPrompt } from "./players.add";

const CancelOption = "❌ Cancel";
const FieldOptions = Object.keys(playerStepPrompt);

export const execute = async (
  message: WhatsAppMessage,
  sessionPlayer: Player,
  editPlayerId: number
) => {
  const { clearActiveCommand, setActiveCommand, updatePlayers, getPlayers } =
    usePlayerStore();
  const senderJid = getSenderFromMessage(message);

  let playerId = editPlayerId ?? getPlayers(sessionPlayer.id)?.edit?.playerId;

  let editPlayer = await getPlayer(playerId);
  if (editPlayer == null) {
    await sendMessage(senderJid, {
      text: "🤕 *No player found to edit*",
    });
    return;
  }

  updatePlayers(sessionPlayer.id, (draft) => {
    draft.edit.playerId = editPlayer!.id;
  });
  setActiveCommand(sessionPlayer.id, Command.PlayersEdit);

  const state = getPlayers(sessionPlayer.id)?.edit;

  if (state?.field) {
    const { required, parse } = getPrompt(state.field);
    const value = parse!(message.body!);
    if (required && !value) {
      await sendMessage(senderJid, {
        text: "⚠️ *Value is required*",
      });
      return;
    }

    editPlayer = await updatePlayer(editPlayer.id, { [state.field]: value });

    updatePlayers(sessionPlayer.id, (draft) => {
      delete draft.edit.field;
    });

    await sendMessage(senderJid, {
      text: `✅ *${titleCase(state.field)} updated*`,
    });
  }

  if (isPollAnswer(message, state?.fieldPollKey)) {
    await deleteMessage(senderJid, state?.fieldPollKey!);
    if (message.body === CancelOption) {
      updatePlayers(sessionPlayer.id, (draft) => {
        draft.edit = {};
      });
      clearActiveCommand(sessionPlayer.id);
      return;
    }

    const field = message.body as keyof PlayerCreate;
    const { prompt } = getPrompt(field);
    updatePlayers(sessionPlayer.id, (draft) => {
      draft.edit.field = field;
      delete draft.edit.fieldPollKey;
    });

    await sendMessage(senderJid, {
      text: prompt,
    });

    return;
  }

  await sendEditPlayerMessage(editPlayer, senderJid);
  await sendEditPollMessage(senderJid, sessionPlayer);
};

const getPlayer = async (playerId: number) => {
  if (playerId == null) {
    return null;
  }
  return await getPlayerById(playerId);
};

const sendEditPlayerMessage = async (editPlayer: Player, senderJid: string) => {
  await sendMessage(senderJid, {
    text: "🤕 *Edit Player*",
  });
  await sendMessage(senderJid, {
    text: formatList([editPlayer]),
  });
};

const sendEditPollMessage = async (
  senderJid: string,
  sessionPlayer: Player
) => {
  const poll = await sendMessage(senderJid, {
    poll: {
      name: "Which field would you like to edit?",
      values: [...FieldOptions, CancelOption],
    },
  });

  usePlayerStore().updatePlayers(sessionPlayer.id, (draft) => {
    draft.edit.fieldPollKey = poll!.key;
  });
};
