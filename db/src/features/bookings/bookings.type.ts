import { Player } from "@db/features/players/players.type";

export type BookingCreate = {
  name: string;
  slug: string;
  announceName: string | null;
  numPlayers: number;
  numGoalies: number;
  location: string;
  cost: string;
  scheduledTime: string;
  startDate: string;
  endDate: string;
  bookedById: string;
  whatsAppGroupJid: string | null;
  notifyGroup: boolean;
};

export type Booking = {
  id: number;
  slug: string | null;
  name: string | null;
  numPlayers: number;
  numGoalies: number;
  location: string | null;
  cost: string | null;
  costPerPlayer: string | null;
  scheduledTime: string | null;
  startDate: string | null;
  endDate: string | null;
  bookedById: string | null;
  whatsAppGroupJid: string | null;
  notifyGroup: boolean;
  announceName: string | null;
  playersToBookings: {
    amountPaid: string | null;
    player: Player;
    position: string;
  }[];
};

export type BookingWithoutPlayers = Omit<Booking, "playersToBookings">;
