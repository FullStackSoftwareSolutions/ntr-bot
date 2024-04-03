import { Player } from "../players/players.type";

export type BookingCreate = {
  name: string;
  numPlayers: number;
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
  numPlayers: number | null;
  location: string | null;
  cost: string | null;
  scheduledTime: string | null;
  startDate: string | null;
  endDate: string | null;
  bookedById: number | null;
  playersToBookings: {
    player: Player;
  }[];
};
