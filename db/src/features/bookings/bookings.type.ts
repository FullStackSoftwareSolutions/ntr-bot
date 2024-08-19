import { Player } from "@db/features/players/players.type";

export type BookingCreate = {
  name: string;
  slug: string;
  announceName: string | null;
  numPlayers: number;
  numGoalies: number;
  location: string;
  cost: string;
  costPerPlayerPerSkate: string;
  scheduledTime: string;
  startDate: string;
  endDate: string;
  dates: string[];
  bookedByUserId: string;
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
  costPerPlayerPerSkate: string | null;
  scheduledTime: string | null;
  startDate: string | null;
  endDate: string | null;
  bookedByUserId: string | null;
  whatsAppGroupJid: string | null;
  notifyGroup: boolean;
  announceName: string | null;
  playersToBookings: {
    id: number;
    amountPaid: string | null;
    player: Player;
    position: string;
    addedOn: Date;
  }[];
};

export type BookingWithSkates = Booking & {
  skates: {
    id: number;
    scheduledOn: Date;
  }[];
};

export type BookingWithoutPlayers = Omit<Booking, "playersToBookings">;
