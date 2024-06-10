import { deleteUser, getAllUsers } from "@db/features/users/users.db";
import { User } from "@db/features/users/users.type";

export const getAllUsersHandler = async () => {
  return getAllUsers();
};

export const deleteUserHandler = async (id: string) => {
  return deleteUser({ id });
};
