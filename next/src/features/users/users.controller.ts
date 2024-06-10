import { deleteUser, getAllUsers } from "@db/features/users/users.db";

export const getAllUsersHandler = async () => {
  return getAllUsers();
};

export const deleteUserHandler = async (id: string) => {
  return deleteUser({ id });
};
