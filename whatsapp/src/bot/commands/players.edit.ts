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
  doKeysMatch,
  getSenderFromMessage,
  PollOptions,
  WhatsAppMessage,
} from "~/features/whatsapp/whatsapp.model";
import { useState } from "../state";
import { Player, PlayerCreate } from "~/features/players/players.type";
import { Command } from "../commands";
import { getPrompt } from "./players.add";
import { playerFieldPrompts } from "~/features/players/players.model";

const FieldOptions = Object.keys(playerFieldPrompts);

export const onCommand = async (
  message: WhatsAppMessage,
  sessionPlayer: Player,
  editPlayerId: number
) => {
  const { setActiveCommand, updatePlayers } = useState();
  const senderJid = getSenderFromMessage(message);

  let editPlayer = await getPlayer(editPlayerId);
  if (editPlayer == null) {
    await sendMessage(senderJid, {
      text: "🤕 *No player found to edit*",
    });
    return;
  }

  updatePlayers(sessionPlayer.id, (draft) => {
    draft.update.playerId = editPlayer!.id;
  });
  setActiveCommand(sessionPlayer.id, Command.PlayersEdit);

  await sendEditPlayerMessage(editPlayer, senderJid);
  await sendEditPollMessage(senderJid, sessionPlayer);
};

export const onPollSelection = async (
  message: WhatsAppMessage,
  sessionPlayer: Player
) => {
  const { clearActiveCommand, updatePlayers, getPlayers } = useState();

  const senderJid = getSenderFromMessage(message);
  const state = getPlayers(sessionPlayer.id)?.update;

  if (doKeysMatch(message.key, state?.fieldPollKey)) {
    await deleteMessage(senderJid, state?.fieldPollKey!);

    if (message.body === PollOptions.Cancel) {
      updatePlayers(sessionPlayer.id, (draft) => {
        draft.update = {};
      });
      clearActiveCommand(sessionPlayer.id);
      return;
    }

    const field = message.body as keyof PlayerCreate;
    const { prompt } = getPrompt(field);

    updatePlayers(sessionPlayer.id, (draft) => {
      draft.update.field = field;
      delete draft.update.fieldPollKey;
    });

    await sendMessage(senderJid, {
      text: prompt,
    });

    return;
  }
};

export const onMessage = async (
  message: WhatsAppMessage,
  sessionPlayer: Player
) => {
  const { updatePlayers, getPlayers } = useState();
  const senderJid = getSenderFromMessage(message);

  const state = getPlayers(sessionPlayer.id)!.update;
  const playerId = state.playerId!;

  let editPlayer = await getPlayer(playerId);
  if (!editPlayer) {
    throw new Error("No player found to edit");
  }

  if (state.field) {
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
      delete draft.update.field;
    });

    await sendMessage(senderJid, {
      text: `✅ *${titleCase(state.field)} updated*`,
    });
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
      values: [...FieldOptions, PollOptions.Cancel],
      selectableCount: 1,
    },
  });

  useState().updatePlayers(sessionPlayer.id, (draft) => {
    draft.update.fieldPollKey = poll!.key;
  });
};
