"use client";

import { useSession } from "@next/providers/SessionProvier";
import UserAvatar from "./UserAvatar";
import { Button } from "@next/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@next/components/ui/popover";
import SignOutButton from "../auth/SignOutButton";

const SignedInUserButton = ({}) => {
  const { user } = useSession();
  if (!user) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="flex rounded-full p-1">
          <UserAvatar user={user} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto">
        <div className="flex flex-col gap-8 p-4">
          <div className="flex items-center gap-3">
            <UserAvatar user={user} />
            <h3 className="whitespace-nowrap text-xl">{user.username}</h3>
          </div>
          <SignOutButton />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SignedInUserButton;
