import { Player } from "../players/players.type";

export type Skate = {
  id: number;
  scheduledOn: Date;
  playersToSkates: {
    player: Player;
    team: string | null;
  }[];
};
