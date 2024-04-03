import {
  usePlayerBookingState,
  usePlayerStore,
  useUpdatePlayerBookingState,
} from "~/bot/state";
import { getBookingById } from "~/features/bookings/bookings.db";
import { getBookingMessage } from "~/features/bookings/bookings.model";
import {
  getAllPlayers,
  getPlayersByNames,
  getPlayersForBooking,
  updatePlayersForBooking,
} from "~/features/players/players.db";
import { getPlayerName } from "~/features/players/players.model";
import { Player } from "~/features/players/players.type";
import {
  formatList,
  stringJoin,
} from "~/features/whatsapp/whatsapp.formatting";
import {
  doKeysMatch,
  getSenderFromMessage,
  isKeyInList,
  PollOptions,
  WhatsAppMessage,
  WhatsAppMessageKey,
} from "~/features/whatsapp/whatsapp.model";
import {
  sendMessage,
  sendPolls,
} from "~/integrations/whatsapp/whatsapp.service";

export const onPollSelection = async (
  message: WhatsAppMessage,
  player: Player
) => {
  const bookingState = usePlayerBookingState(player.id);
  const playersState = bookingState?.update.players;
  const bookingId = bookingState?.update.bookingId;

  if (!bookingId || !playersState) {
    return;
  }

  if (isKeyInList(message.key, playersState.removePollKeys)) {
    return await handleRemovePlayerPollSelection(message, player);
  }
  if (isKeyInList(message.key, playersState.addPollKeys)) {
    return await handleAddPlayerPollSelection(message, player);
  }

  if (doKeysMatch(playersState.confirmPollKey, message.key)) {
    if (message.body === PollOptions.Cancel) {
      return await cancelBookingPlayersPollSelection(message, player);
    }
    if (message.body === PollOptions.Confirm) {
      return await confirmBookingPlayersPollSelection(message, player);
    }
  }
};

export const sendBookingPlayersPollSelection = async (
  message: WhatsAppMessage,
  player: Player
) => {
  const senderJid = getSenderFromMessage(message);
  const bookingState = usePlayerBookingState(player.id);
  const bookingId = bookingState!.read.bookingId!;

  const bookingPlayers = await getPlayersForBooking(bookingId);

  let removePollKeys: WhatsAppMessageKey[] = [];
  let addPollKeys: WhatsAppMessageKey[] = [];
  let confirmPollKey: WhatsAppMessageKey;

  if (bookingPlayers.length !== 0) {
    const removePlayerPolls = await sendPolls(senderJid, {
      name: "🤕 Booking Players (select to remove)",
      values: bookingPlayers.map((player) => `⛔️ ${getPlayerName(player)}`),
    });
    removePollKeys = removePlayerPolls.map((p) => p.key);
  }

  const allPlayers = await getAllPlayers();
  const otherPlayers = allPlayers.filter(
    (p) => !bookingPlayers.find((bp) => bp.id === p.id)
  );

  const addPlayerPolls = await sendPolls(senderJid, {
    name: "✅ New Players (select to add)",
    values: otherPlayers.map((player) => `✅ ${getPlayerName(player)}`),
  });
  addPollKeys = addPlayerPolls.map((p) => p.key);

  const confirmPoll = await sendMessage(senderJid, {
    poll: {
      name: "Confirm above selections",
      values: [PollOptions.Confirm, PollOptions.Cancel],
    },
  });
  confirmPollKey = confirmPoll!.key;

  useUpdatePlayerBookingState(player.id, (draft) => {
    draft.update.bookingId = bookingId;
    draft.update.players = {
      addPlayerIds: [],
      removePlayerIds: [],
      removePollKeys,
      addPollKeys,
      confirmPollKey,
    };
  });
};

const cancelBookingPlayersPollSelection = async (
  message: WhatsAppMessage,
  player: Player
) => {
  const bookingState = usePlayerBookingState(player.id);

  if (bookingState?.update.players?.confirmPollKey) {
    await sendMessage(getSenderFromMessage(message), {
      delete: bookingState.update.players.confirmPollKey,
    });
  }
  for (const key of bookingState?.update.players?.removePollKeys || []) {
    await sendMessage(getSenderFromMessage(message), { delete: key });
  }
  for (const key of bookingState?.update.players?.addPollKeys || []) {
    await sendMessage(getSenderFromMessage(message), { delete: key });
  }

  useUpdatePlayerBookingState(player.id, (draft) => {
    draft.update = {};
  });
  usePlayerStore().clearActiveCommand(player.id);
};

const confirmBookingPlayersPollSelection = async (
  message: WhatsAppMessage,
  player: Player
) => {
  const bookingState = usePlayerBookingState(player.id);
  const updateState = bookingState?.update;

  if (!updateState || !updateState.players || !updateState.bookingId) {
    return;
  }

  await updatePlayersForBooking(
    updateState.bookingId!,
    updateState.players.removePlayerIds,
    updateState.players.addPlayerIds
  );

  cancelBookingPlayersPollSelection(message, player);

  const booking = await getBookingById(updateState.bookingId!);
  await sendMessage(getSenderFromMessage(message), {
    text: getBookingMessage(booking!),
  });
};

const handleRemovePlayerPollSelection = async (
  message: WhatsAppMessage,
  player: Player
) => {
  const names = message.pollVotesForSender?.map((n) => n.replace("⛔️ ", ""));
  const players = names ? await getPlayersByNames(names) : [];

  useUpdatePlayerBookingState(player.id, (draft) => {
    if (!draft.update.players) return;
    draft.update.players.removePlayerIds = players.map((p) => p.id);
  });
};

const handleAddPlayerPollSelection = async (
  message: WhatsAppMessage,
  player: Player
) => {
  const names = message.pollVotesForSender?.map((n) => n.replace("✅ ", ""));
  const players = names ? await getPlayersByNames(names) : [];

  useUpdatePlayerBookingState(player.id, (draft) => {
    if (!draft.update.players) return;
    draft.update.players.addPlayerIds = players.map((p) => p.id);
  });
};
