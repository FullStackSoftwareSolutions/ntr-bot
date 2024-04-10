import { Player } from "../players/players.type";

export type BookingCreate = {
  name: string;
  numPlayers: number;
  numGoalies: number;
  location: string;
  cost: string;
  scheduledTime: string;
  startDate: string;
  endDate: string;
  bookedById: number;
};

export type Booking = {
  id: number;
  name: string | null;
  numPlayers: number;
  numGoalies: number;
  location: string | null;
  cost: string | null;
  costPerPlayer: string | null;
  scheduledTime: string | null;
  startDate: string | null;
  endDate: string | null;
  bookedById: number | null;
  whatsAppGroupJid: string | null;
  announceName: string | null;
  playersToBookings: {
    amountPaid: string | null;
    player: Player;
    position: string;
  }[];
};

export type BookingWithoutPlayers = Omit<Booking, "playersToBookings">;
