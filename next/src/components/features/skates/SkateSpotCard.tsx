"use client";

import { type Player } from "@db/features/players/players.type";
import { formatDateTime } from "@formatting/dates";
import { Badge } from "@next/components/ui/badge";
import { Card } from "@next/components/ui/card";
import { getPlayerName } from "@next/features/players/players.model";
import SkateSpotDialog from "./SkateSpotDialog";
import { type Positions, type Skate } from "@db/features/skates/skates.type";
import { getSkateSubstitubeForPlayer } from "@next/features/skates/skates.model";
import PlayerSpotCard from "../players/PlayerSpotCard";
import { DollarSignIcon } from "lucide-react";

type SkateSpotCardProps = {
  id: number;
  position: Positions;
  player: Player;
  skate: Skate;
  addedOn: Date;
  droppedOutOn?: Date | null;
  substitutePlayer?: Player | null;
  waitingForSub?: boolean;
  paid: boolean;
  className?: string;
};

const SkateSpotCard = (props: SkateSpotCardProps) => {
  const {
    skate,
    player,
    addedOn,
    droppedOutOn,
    substitutePlayer,
    waitingForSub,
    paid,
  } = props;

  const subForPlayer = !droppedOutOn
    ? getSkateSubstitubeForPlayer(skate, player)
    : null;

  return (
    <SkateSpotDialog {...props} subForPlayer={subForPlayer}>
      <Card className="flex flex-1 flex-col gap-2 py-0">
        <PlayerSpotCard player={player} />
        <div className="flex flex-wrap items-start gap-1 p-2 pt-0">
          {paid && (
            <Badge variant="secondary" className="flex gap-1 ps-1">
              <DollarSignIcon size={18} />
              Paid
            </Badge>
          )}
          {!!droppedOutOn && (
            <Badge
              variant={substitutePlayer ? "outline" : "destructive"}
            >{`Out @ ${formatDateTime(droppedOutOn)}`}</Badge>
          )}
          {substitutePlayer && (
            <Badge variant="outline">{`Covered by ${getPlayerName(substitutePlayer)}`}</Badge>
          )}
          {subForPlayer && (
            <Badge>{`Sub for ${getPlayerName(subForPlayer)}`}</Badge>
          )}
          {waitingForSub && (
            <Badge variant="warning">{`Sub @ ${formatDateTime(addedOn)}`}</Badge>
          )}
        </div>
      </Card>
    </SkateSpotDialog>
  );
};

export default SkateSpotCard;
