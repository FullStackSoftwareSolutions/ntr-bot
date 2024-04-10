import {
  getAllPlayers,
  getAllPlayersSearch,
} from "../../features/players/players.db";
import {
  deleteMessage,
  sendMessage,
} from "../../integrations/whatsapp/whatsapp.service";
import { formatList } from "../../features/whatsapp/whatsapp.formatting";
import {
  doKeysMatch,
  getSenderFromMessage,
  isPollAnswer,
  PollOptions,
  WhatsAppMessage,
} from "~/features/whatsapp/whatsapp.model";
import { useState } from "../state";
import { Player } from "~/features/players/players.type";
import { Command } from "../commands";
import { AnyMessageContent } from "@whiskeysockets/baileys";

const MAX_DISPLAYED = 150;

export const onCommand = async (
  message: WhatsAppMessage,
  sessionPlayer: Player,
  search: string
) => {
  const senderJid = getSenderFromMessage(message);

  const { setActiveCommand } = useState();
  setActiveCommand(sessionPlayer.id, Command.Players);

  useState().updatePlayers(sessionPlayer.id, (draft) => {
    draft.read.search = search;
  });

  const players = await getPlayers(sessionPlayer);
  await sendPlayersMessage(players, senderJid, 0, sessionPlayer);

  if (players.length === 0 || players.length <= MAX_DISPLAYED) {
    cancel(sessionPlayer);
    return;
  }
};

export const onPollSelection = async (
  message: WhatsAppMessage,
  sessionPlayer: Player
) => {
  const senderJid = getSenderFromMessage(message);
  const state = useState().getPlayers(sessionPlayer.id);

  let currentPageIndex = state?.read.viewIndex ?? 0;

  if (doKeysMatch(message.key, state?.read.viewPollKey)) {
    await deleteMessage(senderJid, state?.read.viewPollKey!);

    if (message.body === PollOptions.Cancel) {
      cancel(sessionPlayer);
      return;
    }
    if (message.body === PollOptions.PrevPage) {
      currentPageIndex -= 1;
    }
    if (message.body === PollOptions.NextPage) {
      currentPageIndex += 1;
    }

    useState().updatePlayers(sessionPlayer.id, (draft) => {
      draft.read.viewIndex = currentPageIndex;
    });
  }

  const players = await getPlayers(sessionPlayer);
  await sendPlayersMessage(players, senderJid, currentPageIndex, sessionPlayer);
};

const getPlayers = async (sessionPlayer: Player) => {
  const state = useState().getPlayers(sessionPlayer.id);

  return state?.read.search
    ? await getAllPlayersSearch(state.read.search)
    : await getAllPlayers();
};

const cancel = async (sessionPlayer: Player) => {
  const { clearActiveCommand, updatePlayers } = useState();

  updatePlayers(sessionPlayer.id, (draft) => {
    draft.read.viewIndex = 0;
    draft.read.viewPollKey = null;
    draft.read.playerMessageKeys = [];
  });
  clearActiveCommand(sessionPlayer.id);
};

const sendPlayersMessage = async (
  players: Player[],
  senderJid: string,
  index: number,
  sessionPlayer: Player
) => {
  if (players.length === 0) {
    sendMessage(senderJid, { text: "🏒 *No players found*" });
    return;
  }

  const pageData = getPageData(players, index);

  const { getPlayers, updatePlayers } = useState();
  const state = getPlayers(sessionPlayer.id);

  if ((state?.read.playerMessageKeys ?? []).length === 0) {
    await sendMessage(senderJid, {
      text: `🏒 *Players* (${pageData.total})`,
    });
  }

  for (
    let index = 0;
    index < (pageData.numPages === 1 ? players.length : MAX_DISPLAYED);
    index++
  ) {
    const player = pageData.players[index];

    let text = "┏━━━━━━━━━━━━";
    if (player) {
      text = formatList([player]);
    }

    const existingMessage = state?.read.playerMessageKeys?.[index];

    const messageContent: AnyMessageContent = {
      text,
    };
    if (existingMessage) {
      messageContent.edit = existingMessage;
    }
    const message = await sendMessage(senderJid, messageContent);

    updatePlayers(sessionPlayer.id, (draft) => {
      if (!draft.read.playerMessageKeys) {
        draft.read.playerMessageKeys = [];
      }
      draft.read.playerMessageKeys.push(message!.key);
    });
  }

  if (pageData.numPages > 1) {
    await sendPageMessage(pageData, senderJid, sessionPlayer);
  }
};

const getPageData = (players: Player[], index: number) => {
  const page = index + 1;
  const numPages = Math.ceil(players.length / MAX_DISPLAYED);
  return {
    index,
    players: players.slice(
      index * MAX_DISPLAYED,
      index * MAX_DISPLAYED + MAX_DISPLAYED
    ),
    page,
    numPages,
    total: players.length,
  };
};

const sendPageMessage = async (
  pageData: ReturnType<typeof getPageData>,
  senderJid: string,
  player: Player
) => {
  let values = [PollOptions.PrevPage, PollOptions.NextPage, PollOptions.Cancel];
  if (pageData.index === 0) {
    values = [PollOptions.NextPage, PollOptions.Cancel];
  }
  if (pageData.index === pageData.numPages - 1) {
    values = [PollOptions.PrevPage, PollOptions.Cancel];
  }

  const poll = await sendMessage(senderJid, {
    poll: {
      name: `📄 *Page ${pageData.page} of ${pageData.numPages}*`,
      values,
    },
  });

  useState().updatePlayers(player.id, (draft) => {
    draft.read.viewPollKey = poll!.key;
  });
};
