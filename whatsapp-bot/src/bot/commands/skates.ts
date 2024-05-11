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
import { getPlayerName } from "~/features/players/players.model";
import {
  getSkateMessage,
  getSkateNumGoalieSpotsOpen,
  getSkateNumPlayerSpotsOpen,
  getSkatePlayersAndGoaliesIn,
  Positions,
  getSkatePlayersWithSubs,
  getSkateTeamsMessage,
  getSkatePlayersIn,
  getSkateGoaliesIn,
  getSkateGoaliesInWithSubs,
  getSkatePlayersInWithSubs,
  getSkatePlayersWithSubsUnpaid,
} from "~/features/skates/skates.model";
import { Skate } from "~/features/skates/skates.type";
import { useSkateState, useState, useUpdateSkateState } from "../state";
import { Command } from "../commands";
import { getPlayerByName } from "~/features/players/players.db";
import {
  addSkateSubPlayerHandler,
  getSkateAvailableSubsHandler,
  shuffleSkateTeamsHandler,
  updateSkatePlayerOutHandler,
} from "~/features/skates/skates.controller";
import {
  getBookingNotifyJid,
  getCostPerSkatePerPlayerForBooking,
} from "~/features/bookings/bookings.model";
import { formatCurrency } from "~/formatting/currency";

enum SkateActionsPollOptions {
  PlayerOut = "Player Out",
  GoalieOut = "Goalie Out",
  SubstitutePlayer = "Sub Player",
  SubstituteGoalie = "Sub Goalie",
  ShuffleTeams = "Shuffle Teams",
  Announce = "Announce",
  AnnounceTeams = "Announce Teams",
  ViewTeams = "View Teams",
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
  const goalieOutPollKeys = bookingState?.update.goalieOutPollKeys;
  const subPollKeys = bookingState?.update.subPlayerGoaliePollKeys;

  if (doKeysMatch(actionPollKey, message.key!)) {
    return handleSkateActionPollSelection(message, player);
  }
  if (playerOutPollKeys && isKeyInList(message.key, playerOutPollKeys)) {
    return handlePlayerOutPollSelection(message, player);
  }
  if (goalieOutPollKeys && isKeyInList(message.key, goalieOutPollKeys)) {
    return handleGoalieOutPollSelection(message, player);
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
  if (message.body === SkateActionsPollOptions.AnnounceTeams) {
    await announceTeams(skate, message);
  }
  if (message.body === SkateActionsPollOptions.ViewTeams) {
    await viewTeams(skate, message);
  }
  if (message.body === SkateActionsPollOptions.ShuffleTeams) {
    await generateTeams(skate, message);
  }

  if (message.body === SkateActionsPollOptions.PlayerOut) {
    await sendPlayerOutPollMessage(senderJid, sessionPlayer.id);
    return;
  }
  if (message.body === SkateActionsPollOptions.GoalieOut) {
    await sendGoalieOutPollMessage(senderJid, sessionPlayer.id);
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
    await updateSkatePlayerOutHandler(skate.id, Positions.Player, player!.id);
  }

  await sendSkateAndActionPollMessages(message, sessionPlayer);
};

const handleGoalieOutPollSelection = async (
  message: WhatsAppMessage,
  sessionPlayer: Player
) => {
  const skateState = useSkateState(sessionPlayer.id);

  const skate = await getSkate(skateState?.read.skateId);
  if (!skate) {
    throw new Error("No skate selected!");
  }

  for (const key of skateState?.update.goalieOutPollKeys || []) {
    await sendMessage(getSenderFromMessage(message), { delete: key });
  }

  if (message.body !== PollOptions.Cancel) {
    const player = await getPlayerByName(
      getPlayerNameFromPollSelection(message.body!)
    );
    await updateSkatePlayerOutHandler(skate.id, Positions.Goalie, player!.id);
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

  const availablePlayerSubs = await getSkateAvailableSubsHandler(
    skate.id,
    Positions.Player
  );
  const availableGoalieSubs = await getSkateAvailableSubsHandler(
    skate.id,
    Positions.Goalie
  );

  const options = [
    ...Object.values(SkateActionsPollOptions),
    PollOptions.Cancel,
  ].filter((option) => {
    if (option === SkateActionsPollOptions.SubstitutePlayer) {
      return availablePlayerSubs.length > 0;
    }
    if (option === SkateActionsPollOptions.SubstituteGoalie) {
      return availableGoalieSubs.length > 0;
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

  const players = await getSkatePlayersInWithSubs(skate).map(
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

export const sendGoalieOutPollMessage = async (
  senderJid: string,
  playerId: number
) => {
  const skateState = useSkateState(playerId);

  const skate = await getSkate(skateState?.read.skateId);
  if (!skate) {
    throw new Error("No skate selected!");
  }

  const players = await getSkateGoaliesInWithSubs(skate).map(
    ({ player }) => `⛔️ ${getPlayerName(player)}`
  );
  const polls = await sendPolls(senderJid, {
    name: "🤕 Select the goalie that's out",
    values: [...players, PollOptions.Cancel],
    selectableCount: 1,
  });

  useUpdateSkateState(playerId, (draft) => {
    draft.update.goalieOutPollKeys = polls.map((p) => p.key);
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
  await sendMessage(getBookingNotifyJid(skate.booking, message), {
    text: getSkateMessage(skate),
  });
};

const announcePayments = async (skate: Skate, message: WhatsAppMessage) => {
  const players = getSkatePlayersWithSubsUnpaid(skate);
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

  await sendMessage(getBookingNotifyJid(skate.booking, message), {
    text: stringJoin(...payments),
    mentions,
  });
};

const viewTeams = async (skate: Skate, message: WhatsAppMessage) => {
  await sendMessage(getSenderFromMessage(message), {
    text: getSkateTeamsMessage(skate, true),
  });
};

const announceTeams = async (skate: Skate, message: WhatsAppMessage) => {
  await sendMessage(getBookingNotifyJid(skate.booking, message), {
    text: getSkateTeamsMessage(skate),
  });
};

const generateTeams = async (skate: Skate, message: WhatsAppMessage) => {
  const skateWithTeams = await shuffleSkateTeamsHandler(skate.id);
  if (!skateWithTeams) {
    throw new Error("Failed to shuffle teams");
  }

  const senderJid = getSenderFromMessage(message);

  await sendMessage(senderJid, {
    text: getSkateTeamsMessage(skateWithTeams, true),
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
