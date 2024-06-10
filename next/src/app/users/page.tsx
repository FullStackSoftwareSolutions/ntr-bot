import UsersList from "@next/components/features/users/UsersList";
import { UserRoundIcon } from "lucide-react";

export default function UsersPage() {
  return (
    <div className="container flex flex-1 flex-col items-start gap-6 p-8">
      <div className="flex w-full items-center">
        <h1 className="m-8 flex items-center gap-4 text-4xl font-bold">
          <UserRoundIcon /> Users
        </h1>
      </div>
      <UsersList />
    </div>
  );
}
