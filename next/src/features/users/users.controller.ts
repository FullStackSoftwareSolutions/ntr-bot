import { updatePlayer } from "@db/features/players/players.db";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "@db/features/users/users.db";
import { type UserUpdate } from "@db/features/users/users.type";

export const getUserByIdHandler = async (id: string) => {
  return getUserById(id);
};

export const updateUserHandler = async (
  id: string,
  { playerId, admin }: UserUpdate,
) => {
  if (playerId) {
    await updatePlayer(playerId, { userId: id });
  }
  await updateUser(id, { admin });
};

export const getAllUsersHandler = async () => {
  return getAllUsers();
};

export const deleteUserHandler = async (id: string) => {
  return deleteUser({ id });
};
