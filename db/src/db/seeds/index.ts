import { seedPlayers } from "./players.seed";

export const seedData = async () => {
  await seedPlayers();
};
