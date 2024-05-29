"use client";

import { cn } from "@next/lib/utils";
import { api } from "@next/trpc/react";
import PlayerCard from "./PlayerCard";
import { Input } from "@next/components/ui/input";
import { Badge } from "@next/components/ui/badge";
import { useState } from "react";
import { getPlayerSearchTerms } from "@next/features/players/players.model";
import { Button } from "@next/components/ui/button";
import { CheckIcon } from "lucide-react";

type PlayersListProps = {
  className?: string;
};

const PlayersList = ({ className }: PlayersListProps) => {
  const [playerSearch, setPlayerSearch] = useState("");
  const [showGoalies, setShowGoalies] = useState(true);
  const [showPlayers, setShowPlayers] = useState(true);

  const { data: players } = api.players.getAll.useQuery();

  const filteredPlayers = players?.filter(
    (player) =>
      ((player.isGoalie && showGoalies) || (player.isPlayer && showPlayers)) &&
      getPlayerSearchTerms(player)
        .join(" ")
        .toLowerCase()
        .includes(playerSearch.toLowerCase()),
  );

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setShowPlayers(!showPlayers);
            }}
            variant="ghost"
            className="h-auto p-0"
          >
            <Badge variant={showPlayers ? "default" : "outline"}>
              <div
                className={cn(
                  "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-foreground",
                  showPlayers
                    ? "text-background-foreground border-background bg-background "
                    : "opacity-50 [&_svg]:invisible",
                )}
              >
                {showPlayers && <CheckIcon className="size-3" />}
              </div>
              Players
            </Badge>
          </Button>
          <Button
            onClick={() => {
              setShowGoalies(!showGoalies);
            }}
            variant="ghost"
            className="h-auto p-0"
          >
            <Badge variant={showGoalies ? "default" : "outline"}>
              <div
                className={cn(
                  "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-foreground",
                  showGoalies
                    ? "text-background-foreground border-background bg-background"
                    : "opacity-50 [&_svg]:invisible",
                )}
              >
                {showGoalies && <CheckIcon className="size-3" />}
              </div>
              Goalies
            </Badge>
          </Button>
        </div>
        <Input
          onChange={(e) => setPlayerSearch(e.target.value)}
          className="w-full"
          placeholder="Search players..."
        />
      </div>
      <div className={cn("flex flex-wrap items-start gap-4", className)}>
        {filteredPlayers?.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </div>
  );
};

export default PlayersList;
