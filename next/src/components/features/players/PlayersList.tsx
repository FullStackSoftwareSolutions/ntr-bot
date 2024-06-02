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
import { BadgeToggle } from "@next/components/ui/badge-toggle";

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
          <BadgeToggle
            onClick={() => {
              setShowPlayers(!showPlayers);
            }}
            checked={showPlayers}
          >
            Players
          </BadgeToggle>
          <BadgeToggle
            onClick={() => {
              setShowGoalies(!showGoalies);
            }}
            checked={showGoalies}
          >
            Goalies
          </BadgeToggle>
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
