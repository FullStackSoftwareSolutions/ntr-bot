import { db } from "..";
import { players } from "../schema";

const playerData = [
  {
    email: "josh.m.kay@gmail.com",
    fullName: "Josh Kay",
    phoneNumber: "14164644510",
    admin: true,
  },
  {
    email: "rkassam22@hotmail.com",
    fullName: "Rahim Karsan",
    phoneNumber: "14168798485",
  },
];

export const seedPlayers = async () => {
  await db.insert(players).values(playerData);
};
