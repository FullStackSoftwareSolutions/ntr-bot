import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";
import { WhatsAppMessageKey } from "@whatsapp/features/whatsapp/whatsapp.model";
import { produce } from "immer";
import { createJSONStorage, persist } from "zustand/middleware";
import { LocalStorage } from "node-localstorage";
import { PlayerCreate } from "@whatsapp/features/players/players.type";
import { BookingCreate } from "@whatsapp/features/bookings/bookings.type";
import { Positions } from "@whatsapp/features/skates/skates.model";

type Commands = {
  activeCommand: string | null;
  players: {
    read: {
      search?: string;
      viewIndex?: number;
      viewPollKey?: WhatsAppMessageKey | null;
      playerMessageKeys?: WhatsAppMessageKey[];
    };
    update: {
      playerId?: number;
      fieldPollKey?: WhatsAppMessageKey | null;
      field?: keyof PlayerCreate;
    };
    create: {
      step?: keyof PlayerCreate;
      player?: Partial<PlayerCreate>;
    };
  };
  bookings: {
    update: {
      bookingId?: number;
      field?: {
        key?: keyof BookingCreate;
        pollKey?: WhatsAppMessageKey | null;
      };
      players?: {
        removePlayerIds: number[];
        addPlayerIds: number[];
        removePollKeys: WhatsAppMessageKey[];
        addPollKeys: WhatsAppMessageKey[];
        confirmPollKey: WhatsAppMessageKey;
      };
      payments?: {
        playerIds: number[];
        playerPollKeys: WhatsAppMessageKey[];
        confirmPollKey: WhatsAppMessageKey;
      };
    };
    read: {
      bookingId?: number;
      bookingPollKey?: WhatsAppMessageKey | null;
      actionPollKey?: WhatsAppMessageKey | null;
    };
    create: {
      step?: keyof BookingCreate;
      booking?: Partial<BookingCreate>;
    };
  };
  skates: {
    update: {
      skateId?: number;
      playerOutPollKeys?: WhatsAppMessageKey[];
      goalieOutPollKeys?: WhatsAppMessageKey[];
      subPosition?: Positions;
      subPlayerGoaliePollKeys?: WhatsAppMessageKey[];
    };
    read: {
      skateId?: number;
      actionPollKey?: WhatsAppMessageKey | null;
    };
  };
};

type State = {
  commands: Record<number, Commands>;
};

type Actions = {
  registerPlayer: (playerId: number) => void;
  setActiveCommand: (playerId: number, command: string) => void;
  clearActiveCommand: (playerId: number) => void;
  getActiveCommand: (playerId: number) => string | null | undefined;
  getPlayers: (playerId: number) => Commands["players"] | undefined;
  updatePlayers: (
    playerId: number,
    players: (players: NonNullable<Commands["players"]>) => void
  ) => void;
  getBookings: (bookingId: number) => Commands["bookings"] | undefined;
  updateBookings: (
    playerId: number,
    bookings: (bookings: NonNullable<Commands["bookings"]>) => void
  ) => void;
  getSkates: (skateId: number) => Commands["skates"] | undefined;
  updateSkates: (
    playerId: number,
    skates: (skates: NonNullable<Commands["skates"]>) => void
  ) => void;
  reset: () => void;
};

const defaultState: State = { commands: {} };

const stateStorage = new LocalStorage("./state");
export const store = createStore<State & Actions>()(
  persist(
    immer((set, get) => ({
      ...defaultState,
      registerPlayer: (playerId) =>
        set((state) => {
          if (state.commands[playerId]) return;
          state.commands[playerId] = {
            activeCommand: null,
            players: {
              read: {},
              create: {},
              update: {},
            },
            bookings: {
              read: {},
              create: {},
              update: {},
            },
            skates: {
              read: {},
              update: {},
            },
          };
        }),
      setActiveCommand: (playerId, command) =>
        set((state) => {
          if (state.commands[playerId]!.activeCommand === command) return;
          state.commands[playerId]!.activeCommand = command;
        }),
      clearActiveCommand: (playerId) =>
        set((state) => {
          state.commands[playerId]!.activeCommand = null;
        }),
      getActiveCommand: (playerId) => get().commands[playerId]?.activeCommand,
      getPlayers: (playerId) => get().commands[playerId]?.players,
      updatePlayers: (playerId, update) =>
        set((state) => {
          state.commands[playerId]!.players = produce(
            state.commands[playerId]!.players,
            update
          );
        }),
      getBookings: (playerId) => get().commands[playerId]?.bookings,
      updateBookings: (playerId, update) =>
        set((state) => {
          state.commands[playerId]!.bookings = produce(
            state.commands[playerId]!.bookings,
            update
          );
        }),
      getSkates: (playerId) => get().commands[playerId]?.skates,
      updateSkates: (playerId, update) =>
        set((state) => {
          state.commands[playerId]!.skates = produce(
            state.commands[playerId]!.skates,
            update
          );
        }),
      reset: () => set(defaultState),
    })),
    {
      name: "state.json",
      storage: createJSONStorage(() => stateStorage),
    }
  )
);

export const useState = () => {
  const { getState } = store;
  return getState();
};

export const useBookingState = (playerId: number) => {
  const { getBookings } = useState();
  return getBookings(playerId);
};

export const useSkateState = (playerId: number) => {
  const { getSkates } = useState();
  return getSkates(playerId);
};

export const useUpdateBookingState: Actions["updateBookings"] = (
  playerId,
  bookings
) => {
  const { updateBookings } = useState();
  return updateBookings(playerId, bookings);
};

export const useUpdateSkateState: Actions["updateSkates"] = (
  playerId,
  skates
) => {
  const { updateSkates } = useState();
  return updateSkates(playerId, skates);
};
