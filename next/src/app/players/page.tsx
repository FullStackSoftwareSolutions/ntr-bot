import PlayersList from "@next/components/features/players/PlayersList";
import { Button } from "@next/components/ui/button";
import { EditIcon, UserRoundIcon } from "lucide-react";
import Link from "next/link";

export default function PlayersPage() {
  return (
    <div className="container flex flex-1 flex-col items-start gap-6 p-8">
      <div className="flex w-full items-center">
        <h1 className="m-8 flex items-center gap-4 text-4xl font-bold">
          <UserRoundIcon /> Players
        </h1>
        <Button asChild variant="outline" className="gap-2 px-2">
          <Link href="/players/edit">
            <EditIcon /> Edit
          </Link>
        </Button>
      </div>
      <PlayersList />
    </div>
  );
}
