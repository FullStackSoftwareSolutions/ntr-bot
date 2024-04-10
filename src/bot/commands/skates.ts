import {
  sendMessage,
  sendPolls,
} from "../../integrations/whatsapp/whatsapp.service";
import {
  formatStringList,
  stringJoin,
} from "../../features/whatsapp/whatsapp.formatting";
import {
  doKeysMatch,
  getJidFromNumber,
  getMentionFromNumber,
  getSenderFromMessage,
  isKeyInList,
  PollOptions,
  WhatsAppMessage,
} from "~/features/whatsapp/whatsapp.model";
import { Player } from "~/features/players/players.type";
import { getSkateById } from "~/features/skates/skates.db";
import {
  getPlayerName,
  getPlayerSkillLevel,
} from "~/features/players/players.model";
import {
  getSkateMessage,
  getSkateNumGoalieSpotsOpen,
  getSkateNumPlayerSpotsOpen,
  getSkatePlayersAndGoaliesIn,
  getSkateTimeMessage,
  Positions,
  randomizeTeamsForSkate,
  Teams,
  getSkatePlayersWithSubs,
} from "~/features/skates/skates.model";
import { Skate } from "~/features/skates/skates.type";
import { useSkateState, useState, useUpdateSkateState } from "../state";
import { Command } from "../commands";
import { getPlayerByName } from "~/features/players/players.db";
import {
  addSkateSubPlayerHandler,
  getSkateAvailableSubsHandler,
  updateSkatePlayerOutHandler,
} from "~/features/skates/skates.controller";
import { getCostPerSkatePerPlayerForBooking } from "~/features/bookings/bookings.model";
import { formatCurrency } from "~/formatting/currency";

enum SkateActionsPollOptions {
  PlayerGoalieOut = "Player/Goalie Out",
  SubstitutePlayer = "Sub Player",
  SubstituteGoalie = "Sub Goalie",
  GenerateTeams = "Generate Teams",
  Announce = "Announce",
  AnnouncePayments = "Announce Payments",
}

export const onCommand = async (
  message: WhatsAppMessage,
  sessionPlayer: Player,
  skateId: number
) => {
  const skate = await getSkate(skateId);
  const senderJid = getSenderFromMessage(message);

  if (!skate) {
    sendMessage(senderJid, { text: "⛸️ *No skate found*" });
    return;
  }

  useState().setActiveCommand(sessionPlayer.id, Command.Skates);
  useUpdateSkateState(sessionPlayer.id, (draft) => {
    draft.read.skateId = skate.id;
  });

  await sendSkateAndActionPollMessages(message, sessionPlayer);
};

export const onPollSelection = async (
  message: WhatsAppMessage,
  player: Player
) => {
  const bookingState = useSkateState(player.id);
  const actionPollKey = bookingState?.read.actionPollKey;
  const playerOutPollKeys = bookingState?.update.playerOutPollKeys;
  const subPollKeys = bookingState?.update.subPlayerGoaliePollKeys;

  if (doKeysMatch(actionPollKey, message.key!)) {
    return handleSkateActionPollSelection(message, player);
  }
  if (playerOutPollKeys && isKeyInList(message.key, playerOutPollKeys)) {
    return handlePlayerOutPollSelection(message, player);
  }
  if (subPollKeys && isKeyInList(message.key, subPollKeys)) {
    return handleSubPollSelection(message, player);
  }
};

const handleSkateActionPollSelection = async (
  message: WhatsAppMessage,
  sessionPlayer: Player
) => {
  const senderJid = getSenderFromMessage(message);
  const skateState = useSkateState(sessionPlayer.id);

  const skate = await getSkate(skateState?.read.skateId);
  if (!skate) {
    throw new Error("No skate selected!");
  }

  const existingPollKey = skateState?.read.actionPollKey;
  if (existingPollKey) {
    await sendMessage(senderJid, { delete: existingPollKey });
    useUpdateSkateState(sessionPlayer.id, (draft) => {
      delete draft.read.actionPollKey;
    });
  }

  if (message.body === SkateActionsPollOptions.Announce) {
    await announceSkate(skate, message);
  }
  if (message.body === SkateActionsPollOptions.AnnouncePayments) {
    await announcePayments(skate, message);
  }

  if (message.body === SkateActionsPollOptions.PlayerGoalieOut) {
    await sendPlayerOutPollMessage(senderJid, sessionPlayer.id);
    return;
  }

  if (
    message.body === SkateActionsPollOptions.SubstitutePlayer ||
    message.body === SkateActionsPollOptions.SubstituteGoalie
  ) {
    const position =
      message.body === SkateActionsPollOptions.SubstitutePlayer
        ? Positions.Player
        : Positions.Goalie;
    await sendSubPlayerPollMessage(senderJid, sessionPlayer.id, position);
    return;
  }

  if (message.body === PollOptions.Cancel) {
    useUpdateSkateState(sessionPlayer.id, (draft) => {
      draft.read = {};
    });
    useState().clearActiveCommand(sessionPlayer.id);
    return;
  }

  await sendActionPollMessage(message, sessionPlayer);
};

const handlePlayerOutPollSelection = async (
  message: WhatsAppMessage,
  sessionPlayer: Player
) => {
  const skateState = useSkateState(sessionPlayer.id);

  const skate = await getSkate(skateState?.read.skateId);
  if (!skate) {
    throw new Error("No skate selected!");
  }

  for (const key of skateState?.update.playerOutPollKeys || []) {
    await sendMessage(getSenderFromMessage(message), { delete: key });
  }

  if (message.body !== PollOptions.Cancel) {
    const player = await getPlayerByName(
      getPlayerNameFromPollSelection(message.body!)
    );
    await updateSkatePlayerOutHandler(skate.id, player!.id);
  }

  await sendSkateAndActionPollMessages(message, sessionPlayer);
};

const handleSubPollSelection = async (
  message: WhatsAppMessage,
  sessionPlayer: Player
) => {
  const skateState = useSkateState(sessionPlayer.id);

  const position = skateState?.update.subPosition;
  for (const key of skateState?.update.subPlayerGoaliePollKeys || []) {
    await sendMessage(getSenderFromMessage(message), { delete: key });
  }

  if (message.body !== PollOptions.Cancel) {
    const player = await getPlayerByName(
      getPlayerNameFromPollSelection(message.body!)
    );
    await addSkateSubPlayerHandler(
      skateState?.read.skateId!,
      player!.id,
      position!
    );
  }

  await sendSkateAndActionPollMessages(message, sessionPlayer);
};

export const sendSkateAndActionPollMessages = async (
  message: WhatsAppMessage,
  sessionPlayer: Player
) => {
  const senderJid = getSenderFromMessage(message);
  const skateState = useSkateState(sessionPlayer.id);
  const skate = await getSkate(skateState?.read.skateId);
  if (!skate) {
    throw new Error("No skate selected!");
  }

  await sendMessage(senderJid, {
    text: getSkateMessage(skate),
  });
  await sendActionPollMessage(message, sessionPlayer);
};

export const sendActionPollMessage = async (
  message: WhatsAppMessage,
  sessionPlayer: Player
) => {
  const senderJid = getSenderFromMessage(message);
  const skateState = useSkateState(sessionPlayer.id);

  const skate = await getSkate(skateState?.read.skateId);
  if (!skate) {
    throw new Error("No skate selected!");
  }

  const options = [
    ...Object.values(SkateActionsPollOptions),
    PollOptions.Cancel,
  ].filter((option) => {
    if (option === SkateActionsPollOptions.SubstitutePlayer) {
      return getSkateNumPlayerSpotsOpen(skate) > 0;
    }
    if (option === SkateActionsPollOptions.SubstituteGoalie) {
      return getSkateNumGoalieSpotsOpen(skate) > 0;
    }
    return true;
  });

  const poll = await sendMessage(senderJid, {
    poll: {
      name: "Select an action for this skate",
      values: options,
      selectableCount: 1,
    },
  });

  useUpdateSkateState(sessionPlayer.id, (draft) => {
    draft.read.actionPollKey = poll!.key;
  });
};

export const sendPlayerOutPollMessage = async (
  senderJid: string,
  playerId: number
) => {
  const skateState = useSkateState(playerId);

  const skate = await getSkate(skateState?.read.skateId);
  if (!skate) {
    throw new Error("No skate selected!");
  }

  const players = await getSkatePlayersAndGoaliesIn(skate).map(
    ({ player }) => `⛔️ ${getPlayerName(player)}`
  );
  const polls = await sendPolls(senderJid, {
    name: "🤕 Select the player that's out",
    values: [...players, PollOptions.Cancel],
    selectableCount: 1,
  });

  useUpdateSkateState(playerId, (draft) => {
    draft.update.playerOutPollKeys = polls.map((p) => p.key);
  });
};

export const sendSubPlayerPollMessage = async (
  senderJid: string,
  playerId: number,
  position: Positions
) => {
  const skateState = useSkateState(playerId);
  const players = await getSkateAvailableSubsHandler(
    skateState?.read.skateId!,
    position
  );
  const playerOptions = players.map((player) => `✅ ${getPlayerName(player)}`);

  const polls = await sendPolls(senderJid, {
    name: `🙋‍♂ Select the new ${position} sub`,
    values: [...playerOptions, PollOptions.Cancel],
    selectableCount: 1,
  });

  useUpdateSkateState(playerId, (draft) => {
    draft.update.subPosition = position;
    draft.update.subPlayerGoaliePollKeys = polls.map((p) => p.key);
  });
};

const announceSkate = async (skate: Skate, message: WhatsAppMessage) => {
  const sendToJid =
    skate.booking.whatsAppGroupJid ?? getSenderFromMessage(message);

  await sendMessage(sendToJid, {
    text: getSkateMessage(skate),
  });
};

const announcePayments = async (skate: Skate, message: WhatsAppMessage) => {
  const sendToJid =
    skate.booking.whatsAppGroupJid ?? getSenderFromMessage(message);

  const players = getSkatePlayersWithSubs(skate);
  const cost = getCostPerSkatePerPlayerForBooking(skate.booking, true);

  const mentions = players.flatMap(({ player, substitutePlayer }) => [
    getJidFromNumber(player.phoneNumber),
    getJidFromNumber(substitutePlayer!.phoneNumber),
  ]);

  const payments = players.map(
    ({ player, substitutePlayer }) =>
      `💰 ${getMentionFromNumber(
        substitutePlayer!.phoneNumber
      )} send ${formatCurrency(cost)} to ${
        player.email
      } 👈 ${getMentionFromNumber(player.phoneNumber)}`
  );

  await sendMessage(sendToJid, {
    text: stringJoin(...payments),
    mentions,
  });
};

const generateTeams = async (skate: Skate, message: WhatsAppMessage) => {
  const teams = randomizeTeamsForSkate(skate);
  const senderJid = getSenderFromMessage(message);

  const teamBlack = formatStringList(
    teams[Teams.Black].map(
      (p) => `[${getPlayerSkillLevel(p)}] ${getPlayerName(p)}`
    ),
    {
      header: {
        content: Teams.Black,
      },
    }
  );
  const teamWhite = formatStringList(
    teams[Teams.White].map(
      (p) => `[${getPlayerSkillLevel(p)}] ${getPlayerName(p)}`
    ),
    {
      header: {
        content: Teams.White,
      },
    }
  );
  const header = `🏒 *${skate.booking!.announceName}* ${getSkateTimeMessage(
    skate
  )}`;

  const skateFormat = stringJoin(header, "", teamBlack, "", teamWhite);

  await sendMessage(senderJid, {
    text: skateFormat,
  });
};

const getSkate = async (skateId: number | null | undefined) => {
  if (!skateId) {
    return null;
  }
  return await getSkateById(skateId);
};

const getPlayerNameFromPollSelection = (name: string) =>
  name.replace("✅ ", "").replace("⛔️ ", "");
