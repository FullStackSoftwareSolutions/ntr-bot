import { BookingWithoutPlayers } from "../bookings/bookings.type";
import { Player } from "../players/players.type";

export type Skate = {
  id: number;
  slug: string | null;
  scheduledOn: Date;
  playersToSkates: {
    id: number;
    player: Player;
    team: string | null;
    addedOn: Date;
    droppedOutOn: Date | null;
    substitutePlayer: Player | null;
    position: string;
    paid: boolean;
  }[];
  booking: BookingWithoutPlayers;
};
