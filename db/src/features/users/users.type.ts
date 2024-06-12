import { Player } from "../players/players.type";

export type User = {
  id: string;
  username: string | null;
  githubId: number | null;
  admin: boolean;
  player?: Player | null | undefined;
};

export type UserUpdate = {
  admin: boolean;
  playerId?: number | null;
};
