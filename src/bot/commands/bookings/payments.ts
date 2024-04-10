import { useBookingState, useState, useUpdateBookingState } from "~/bot/state";
import {
  getBookingById,
  updateBookingPlayersAmountPaid,
} from "~/features/bookings/bookings.db";
import {
  getBookingMessage,
  getPaymentAmountsForBooking,
} from "~/features/bookings/bookings.model";
import {
  getPlayersByNames,
  getPlayersForBooking,
} from "~/features/players/players.db";
import { getPlayerName } from "~/features/players/players.model";
import { Player } from "~/features/players/players.type";
import {
  doKeysMatch,
  getSenderFromMessage,
  isKeyInList,
  PollOptions,
  WhatsAppMessage,
  WhatsAppMessageKey,
} from "~/features/whatsapp/whatsapp.model";
import { formatCurrency, parseCurrency } from "~/formatting/currency";
import {
  sendMessage,
  sendPolls,
} from "~/integrations/whatsapp/whatsapp.service";
import { bookingCommandPrompt } from "../bookings";

export const onPollSelection = async (
  message: WhatsAppMessage,
  player: Player
) => {
  const bookingState = useBookingState(player.id);
  const paymentsState = bookingState?.update.payments;
  const bookingId = bookingState?.update.bookingId;

  if (!bookingId || !paymentsState) {
    return;
  }

  if (isKeyInList(message.key, paymentsState.playerPollKeys)) {
    return await handlePlayerPollSelection(message, player);
  }

  if (doKeysMatch(paymentsState.confirmPollKey, message.key)) {
    if (message.body === PollOptions.Cancel) {
      return await cancelBookingPaymentsPollSelection(message, player);
    }
    return await handlePaymentsPollSelection(message, player);
  }
};

export const sendBookingPaymentsPollSelection = async (
  message: WhatsAppMessage,
  player: Player
) => {
  const senderJid = getSenderFromMessage(message);
  const bookingState = useBookingState(player.id);
  const bookingId = bookingState!.read.bookingId!;

  const booking = await getBookingById(bookingId);
  const bookingPlayers = await getPlayersForBooking(bookingId);

  let playerPollKeys: WhatsAppMessageKey[] = [];
  let confirmPollKey: WhatsAppMessageKey;

  if (bookingPlayers.length !== 0) {
    const playerPolls = await sendPolls(senderJid, {
      name: "💵 Player Payments",
      values: bookingPlayers.map(
        (player) =>
          `🤑 ${getPlayerName(player)} (${formatCurrency(
            Number(player.playersToBookings.amountPaid ?? 0)
          )})`
      ),
    });
    playerPollKeys = playerPolls.map((p) => p.key);
  }

  const confirmPoll = await sendMessage(senderJid, {
    poll: {
      name: "How much have the selected players paid?",
      values: [
        ...getPaymentAmountsForBooking(booking!).map(formatCurrency),
        PollOptions.Cancel,
      ],
      selectableCount: 1,
    },
  });
  confirmPollKey = confirmPoll!.key;

  useUpdateBookingState(player.id, (draft) => {
    draft.update.bookingId = bookingId;
    draft.update.payments = {
      playerIds: [],
      playerPollKeys,
      confirmPollKey,
    };
  });
};

const cancelBookingPaymentsPollSelection = async (
  message: WhatsAppMessage,
  player: Player
) => {
  const bookingState = useBookingState(player.id);

  if (bookingState?.update.payments?.confirmPollKey) {
    await sendMessage(getSenderFromMessage(message), {
      delete: bookingState.update.payments.confirmPollKey,
    });
  }
  for (const key of bookingState?.update.payments?.playerPollKeys || []) {
    await sendMessage(getSenderFromMessage(message), { delete: key });
  }

  useUpdateBookingState(player.id, (draft) => {
    draft.update = {};
  });
  bookingCommandPrompt(getSenderFromMessage(message), player.id);
};

const handlePaymentsPollSelection = async (
  message: WhatsAppMessage,
  player: Player
) => {
  const bookingState = useBookingState(player.id);
  const updateState = bookingState?.update;

  if (!updateState || !updateState.payments || !updateState.bookingId) {
    return;
  }

  const amountPaid = parseCurrency(message.body!);
  await updateBookingPlayersAmountPaid(
    updateState.bookingId,
    updateState.payments.playerIds,
    amountPaid.toString()
  );

  cancelBookingPaymentsPollSelection(message, player);

  const booking = await getBookingById(updateState.bookingId!);
  await sendMessage(getSenderFromMessage(message), {
    text: getBookingMessage(booking!),
  });
};

const getPlayerNameFromPollSelection = (name: string) => {
  return name.split(" (")[0]?.replace("🤑 ", "")!;
};

const getPlayerIdsForNames = async (names: string[]) => {
  if (names.length === 0) return [];
  const players = await getPlayersByNames(names);
  return players.map((p) => p.id);
};

const handlePlayerPollSelection = async (
  message: WhatsAppMessage,
  player: Player
) => {
  const bookingState = useBookingState(player.id);
  const allSelectedIds = bookingState?.update.payments?.playerIds || [];

  const playersInPoll = message.pollMessage!.map(({ name }) =>
    getPlayerNameFromPollSelection(name)
  );
  const playerIdsInPoll = await getPlayerIdsForNames(playersInPoll);
  const otherPollSelectedIds = allSelectedIds.filter(
    (id) => !playerIdsInPoll.includes(id)
  );

  const selectedPollPlayers = message.pollVotesForSender?.map(
    getPlayerNameFromPollSelection
  );
  const selectedPollPlayerIds = await getPlayerIdsForNames(
    selectedPollPlayers!
  );

  const selectedPlayerIds = [...otherPollSelectedIds, ...selectedPollPlayerIds];

  useUpdateBookingState(player.id, (draft) => {
    if (!draft.update.payments) return;
    draft.update.payments.playerIds = selectedPlayerIds;
  });
};
