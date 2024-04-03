import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";
import { WhatsAppMessageKey } from "~/features/whatsapp/whatsapp.model";
import { produce } from "immer";
import { createJSONStorage, persist } from "zustand/middleware";
import { LocalStorage } from "node-localstorage";
import { PlayerCreate } from "~/features/players/players.type";

type Commands = {
  activeCommand: string | null;
  players: {
    viewIndex?: number;
    viewPollKey?: WhatsAppMessageKey | null;
    playerMessageKeys?: WhatsAppMessageKey[];
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
      players?: {
        removePlayerIds: number[];
        addPlayerIds: number[];
        removePollKeys: WhatsAppMessageKey[];
        addPollKeys: WhatsAppMessageKey[];
        confirmPollKey: WhatsAppMessageKey;
      };
    };
    read: {
      bookingId?: number;
      bookingPollKey?: WhatsAppMessageKey | null;
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
              update: {},
              create: {},
            },
            bookings: {
              update: {},
              read: {},
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
      reset: () => set(defaultState),
    })),
    {
      name: "state.json",
      storage: createJSONStorage(() => stateStorage),
    }
  )
);

export const usePlayerStore = () => {
  const { getState } = store;
  return getState();
};

export const usePlayerBookingState = (playerId: number) => {
  const { getBookings } = usePlayerStore();
  return getBookings(playerId);
};
export const useUpdatePlayerBookingState: Actions["updateBookings"] = (
  playerId,
  bookings
) => {
  const { updateBookings } = usePlayerStore();
  return updateBookings(playerId, bookings);
};
