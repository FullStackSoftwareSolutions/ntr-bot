import { type User } from "@db/features/users/users.type";
import { Card, CardHeader, CardTitle } from "@next/components/ui/card";
import { Badge } from "@next/components/ui/badge";
import { Button } from "@next/components/ui/button";
import Link from "next/link";

type UserCardProps = {
  user: User;
};

const UserCard = ({ user }: UserCardProps) => {
  return (
    <Button asChild variant="ghost" className="h-auto p-0.5 text-start">
      <Link href={`/user/${encodeURIComponent(user.id)}`}>
        <Card className="w-full overflow-hidden hover:bg-card/90 sm:w-64">
          <CardHeader>
            <CardTitle className="flex flex-wrap items-start gap-2 whitespace-pre-wrap">
              {user.username ?? "?"}
              {user.admin && <Badge variant="secondary">admin</Badge>}
            </CardTitle>
            <div className="flex flex-col gap-4">
              <div className="whitespace-pre-wrap break-all text-foreground/40">
                <p>{user.id}</p>
                <p>{user.githubId}</p>
              </div>
            </div>
          </CardHeader>
        </Card>
      </Link>
    </Button>
  );
};

export default UserCard;
