import PlayersList from "@next/components/features/players/PlayersList";
import { UserRoundIcon } from "lucide-react";

export default function PlayersPage() {
  return (
    <div className="container flex flex-1 flex-col items-start gap-6 p-8">
      <h1 className="m-8 flex items-center gap-4 text-4xl font-bold">
        <UserRoundIcon /> Players
      </h1>
      <PlayersList />
    </div>
  );
}
