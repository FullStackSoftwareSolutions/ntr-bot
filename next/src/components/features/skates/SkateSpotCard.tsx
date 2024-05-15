"use client";

import { type Player } from "@db/features/players/players.type";
import { formatDateTime } from "@formatting/dates";
import { Badge } from "@next/components/ui/badge";
import { Card, CardFooter } from "@next/components/ui/card";
import {
  getPlayerName,
  getPlayerSkillNumber,
} from "@next/features/players/players.model";
import PlayerAvatarPopover from "../players/PlayerAvatarPopover";
import SkateDropOutButton from "./SkateDropOutButton";
import { type Skate } from "@db/features/skates/skates.type";
import { type Positions } from "@next/features/skates/skates.model";

type SkateSpotCardProps = {
  position: Positions;
  player: Player;
  skate: Skate;
  droppedOutOn?: Date | null;
};

const SkateSpotCard = ({
  player,
  skate,
  droppedOutOn,
  position,
}: SkateSpotCardProps) => {
  return (
    <Card className="flex flex-col">
      <div className="flex flex-1 flex-wrap items-center gap-3 whitespace-pre-wrap p-4 text-2xl font-semibold tracking-tight">
        <PlayerAvatarPopover player={player} />
        {getPlayerName(player)}
        <Badge variant="secondary" className="ml-auto">
          {getPlayerSkillNumber(player)}
        </Badge>
      </div>
      {!!droppedOutOn && (
        <div className="flex flex-col items-start gap-1 p-2 pt-0">
          <Badge variant="destructive">Dropped Out</Badge>
          <p className="ps-1 text-sm">{formatDateTime(droppedOutOn)}</p>
        </div>
      )}
      {!droppedOutOn && (
        <CardFooter className="flex max-h-20 flex-col items-stretch gap-2 overflow-hidden border-t p-1">
          <SkateDropOutButton
            className="ml-auto"
            player={player}
            skate={skate}
            position={position}
          />
        </CardFooter>
      )}
    </Card>
  );
};

export default SkateSpotCard;
