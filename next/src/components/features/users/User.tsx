"use client";

import { type User } from "@db/features/users/users.type";
import { Card, CardHeader, CardTitle } from "@next/components/ui/card";
import UserMoreOptions from "./UserMoreOptions";
import { Badge } from "@next/components/ui/badge";
import { api } from "@next/trpc/react";
import {
  ArrowRightIcon,
  CircleDotIcon,
  CircleIcon,
  DotIcon,
} from "lucide-react";
import PlayerCard from "../players/PlayerCard";

type UserProps = {
  id: string;
};

const User = ({ id }: UserProps) => {
  const { data: user } = api.users.getById.useQuery({ id });

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-16">
        <div className="flex flex-col items-start gap-1">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl">{user.username ?? "?"}</h1>
            <UserMoreOptions user={user} />
          </div>
          <p>{user.id}</p>
          {user.admin && <Badge variant="secondary">admin</Badge>}
        </div>
      </div>

      <div className="m-6 flex gap-6">
        {user.player && <PlayerCard player={user.player} />}
        <div className="m-2">
          <label>Github ID</label>
          <div className="flex items-center text-foreground/40">
            <DotIcon />
            {user.githubId}
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
