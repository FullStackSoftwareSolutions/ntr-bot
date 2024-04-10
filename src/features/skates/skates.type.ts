import { BookingWithoutPlayers } from "../bookings/bookings.type";
import { Player } from "../players/players.type";

export type Skate = {
  id: number;
  scheduledOn: Date;
  playersToSkates: {
    player: Player;
    team: string | null;
    droppedOutOn: Date | null;
    substitutePlayer: Player | null;
    position: string;
  }[];
  booking: BookingWithoutPlayers;
};
