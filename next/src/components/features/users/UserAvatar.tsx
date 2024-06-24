import { type User } from "@db/features/users/users.type";
import { Avatar, AvatarFallback } from "@next/components/ui/avatar";
import { getUserInitials } from "@next/features/users/users.model";

type UserAvatarProps = {
  user: User;
};

const UserAvatar = ({ user }: UserAvatarProps) => {
  const initials = getUserInitials(user);
  if (!initials) {
    return null;
  }

  return (
    <Avatar className="h-8 w-8 text-base font-normal">
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
