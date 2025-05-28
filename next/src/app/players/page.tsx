import PlayerAddDialog from "@next/components/features/players/create/PlayerAddDialog";
import PlayersList from "@next/components/features/players/PlayersList";
import { Button } from "@next/components/ui/button";
import { EditIcon, UserRoundIcon } from "lucide-react";
import Link from "next/link";

export default function PlayersPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-8">
      <div className="flex w-full items-center">
        <h1 className="m-8 flex items-center gap-4 text-4xl font-bold">
          <UserRoundIcon /> Players
        </h1>
        <div className="flex gap-2">
          <PlayerAddDialog />
          <Button size="sm" asChild variant="outline" className="gap-2 px-2">
            <Link href="/players/edit">
              <EditIcon /> Edit
            </Link>
          </Button>
        </div>
      </div>
      <PlayersList />
    </div>
  );
}
