"use client";

import { cn } from "@next/lib/utils";
import { api } from "@next/trpc/react";
import UserCard from "./UserCard";

type UsersListProps = {
  className?: string;
};

const UsersList = ({ className }: UsersListProps) => {
  const { data: users } = api.users.getAll.useQuery();

  return (
    <div className="flex w-full flex-col gap-4">
      <div className={cn("flex flex-wrap items-start gap-4", className)}>
        {users?.map((user) => <UserCard key={user.id} user={user} />)}
      </div>
    </div>
  );
};

export default UsersList;
