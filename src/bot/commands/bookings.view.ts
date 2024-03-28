import { sendMessage } from "../../integrations/whatsapp/whatsapp.service";
import EventEmitter from "node:events";
import {
  doKeysMatch,
  getSenderFromMessage,
  isPollResponse,
  WhatsAppMessage,
  WhatsAppMessageKey,
} from "~/features/whatsapp/whatsapp.model";
import { Player } from "~/features/players/players.type";
import {
  getAllBookings,
  getBookingById,
} from "~/features/bookings/bookings.db";
import { Booking } from "~/features/bookings/bookings.type";
import {
  formatList,
  stringJoin,
} from "~/features/whatsapp/whatsapp.formatting";
import { getSkatesForBooking } from "~/features/skates/skates.db";
import { getPlayersForBooking } from "~/features/players/players.db";

const bookingsView: {
  [playerId: number]: {
    booking?: Booking;
    pollKey?: WhatsAppMessageKey;
  } | null;
} = {};

export const execute = async (message: WhatsAppMessage, player: Player) => {
  const senderJid = getSenderFromMessage(message);
  const session = bookingsView[player.id];

  if (message.body === "cancel") {
    delete bookingsView[player.id];
    await sendMessage(senderJid, {
      text: "cancelled viewing booking",
    });
    completed();
    return;
  }

  if (session?.booking) {
    processSelectedBooking(message, player);
    return;
  }

  await processBookingSelection(message, player);
};

const commandEventEmitter = new EventEmitter();
const completed = async () => {
  commandEventEmitter.emit("complete");
};

export const onComplete = (cb: () => void) => {
  commandEventEmitter.on("complete", cb);
};

const processBookingSelection = async (
  message: WhatsAppMessage,
  player: Player
) => {
  const senderJid = getSenderFromMessage(message);
  const session = bookingsView[player.id];

  if (!session) {
    const bookings = await getAllBookings();
    const poll = await sendMessage(senderJid, {
      poll: {
        name: "Which booking would you like to view?",
        values: bookings.map((booking) => `[${booking.id}] ${booking.name}`),
        selectableCount: 1,
      },
    });
    bookingsView[player.id] = {
      pollKey: poll!.key,
    };
    return;
  }

  if (
    session &&
    isPollResponse(message) &&
    doKeysMatch(session.pollKey!, message.key!)
  ) {
    const regExp = /(?<=\[).+?(?=\])/g;
    const selectedId = message.body?.match(regExp)?.[0];
    if (!selectedId) {
      return;
    }

    const bookingsId = parseInt(selectedId);
    const [booking] = await getBookingById(bookingsId);
    bookingsView[player.id] = {
      booking,
    };

    await sendMessage(senderJid, { delete: session.pollKey! });
    await sendMessage(senderJid, {
      text: stringJoin("📆 *Booking*", formatList([booking!])),
    });

    await bookingCommandPrompt(senderJid, player.id);

    return;
  }

  await sendMessage(senderJid, {
    text: "vote for a booking to view it or type 'cancel' to cancel",
  });
};

const processSelectedBooking = async (
  message: WhatsAppMessage,
  player: Player
) => {
  const senderJid = getSenderFromMessage(message);
  const session = bookingsView[player.id];
  const booking = session!.booking;

  if (
    session &&
    isPollResponse(message) &&
    doKeysMatch(session.pollKey!, message.key!)
  ) {
    if (message.body === "skates") {
      const skates = await getSkatesForBooking(booking!.id);
      await sendMessage(senderJid, {
        text: formatList(skates, { header: { content: "⛸️ *Skates*" } }),
      });
      await bookingCommandPrompt(senderJid, player.id);
      return;
    }
    if (message.body === "players") {
      const players = await getPlayersForBooking(booking!.id);
      if (players.length === 0) {
        await sendMessage(senderJid, {
          text: "No players have joined this booking yet",
        });
      } else {
        await sendMessage(senderJid, {
          text: formatList(players, { header: { content: "🤕 *Players*" } }),
        });
      }

      await bookingCommandPrompt(senderJid, player.id);
      return;
    }
    return;
  }

  await sendMessage(senderJid, {
    text: "vote for an action or type 'cancel' to cancel",
  });
};

const bookingCommandPrompt = async (senderJid: string, playerId: number) => {
  const existingPollKey = bookingsView[playerId]?.pollKey;
  if (existingPollKey) {
    await sendMessage(senderJid, { delete: existingPollKey });
    bookingsView[playerId] = {
      ...bookingsView[playerId],
      pollKey: undefined,
    };
  }

  const poll = await sendMessage(senderJid, {
    poll: {
      name: "Select an action for this booking",
      values: ["skates", "players"],
      selectableCount: 1,
    },
  });
  bookingsView[playerId] = {
    ...bookingsView[playerId],
    pollKey: poll!.key,
  };
};
