import PlayersEditList from "@next/components/features/players/edit/PlayersEditList";
import { UserRoundIcon } from "lucide-react";

export default function PlayersEditPage() {
  return (
    <div className="container flex flex-1 flex-col items-start gap-6 p-8">
      <h1 className="m-8 flex items-center gap-4 text-4xl font-bold">
        <UserRoundIcon /> Edit Players
      </h1>
      <PlayersEditList />
    </div>
  );
}
