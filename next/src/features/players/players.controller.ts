import {
  getAllPlayersAndGoalies,
  getPlayerByEmail,
} from "@db/features/players/players.db";

export const getAllPlayersHandler = async () => {
  return getAllPlayersAndGoalies();
};

export const getPlayerByEmailHandler = async ({ email }: { email: string }) => {
  return getPlayerByEmail(email);
};
