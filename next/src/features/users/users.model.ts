import { type User } from "@db/features/users/users.type";

export const getUserInitials = (user: User) => {
  return user.username?.charAt(0).toUpperCase();
};
