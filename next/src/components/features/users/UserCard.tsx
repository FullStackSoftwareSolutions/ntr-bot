import { type User } from "@db/features/users/users.type";
import { Card, CardHeader, CardTitle } from "@next/components/ui/card";
import UserMoreOptions from "./UserMoreOptions";

type UserCardProps = {
  user: User;
};

const UserCard = ({ user }: UserCardProps) => {
  return (
    <Card className="w-full overflow-hidden hover:bg-card/90 sm:w-64">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-start gap-2 whitespace-pre-wrap">
          {user.username ?? "?"}
          <UserMoreOptions user={user} />
        </CardTitle>
        <div className="flex flex-col gap-4">
          <div className="whitespace-pre-wrap break-all text-foreground/40">
            <p>{user.id}</p>
            <p>{user.githubId}</p>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default UserCard;
