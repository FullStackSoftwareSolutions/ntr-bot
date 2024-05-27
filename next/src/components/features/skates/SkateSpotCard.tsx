"use client";

import { type Player } from "@db/features/players/players.type";
import { formatDateTime } from "@formatting/dates";
import { Badge } from "@next/components/ui/badge";
import { Card } from "@next/components/ui/card";
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
  addedOn: Date;
  droppedOutOn?: Date | null;
  substitutePlayer?: Player | null;
  waitingForSub?: boolean;
};

const SkateSpotCard = ({
  player,
  skate,
  addedOn,
  droppedOutOn,
  position,
  substitutePlayer,
  waitingForSub,
}: SkateSpotCardProps) => {
  if (droppedOutOn) {
    return (
      <SkateSpotCardContent
        player={player}
        skate={skate}
        addedOn={addedOn}
        droppedOutOn={droppedOutOn}
        position={position}
        substitutePlayer={substitutePlayer}
        waitingForSub={waitingForSub}
      />
    );
  }

  return (
    <SkateDropOutButton player={player} skate={skate} position={position}>
      <SkateSpotCardContent
        player={player}
        skate={skate}
        addedOn={addedOn}
        droppedOutOn={droppedOutOn}
        position={position}
        substitutePlayer={substitutePlayer}
        waitingForSub={waitingForSub}
      />
    </SkateDropOutButton>
  );
};

const SkateSpotCardContent = ({
  player,
  addedOn,
  droppedOutOn,
  substitutePlayer,
  waitingForSub,
}: SkateSpotCardProps) => {
  return (
    <Card className="flex flex-1 flex-col">
      <div className="relative flex flex-1 flex-wrap items-center gap-3 whitespace-pre-wrap p-4 text-2xl font-semibold tracking-tight">
        <PlayerAvatarPopover player={player} />
        {getPlayerName(player)}
        <Badge variant="secondary" className="absolute right-0 top-0">
          {getPlayerSkillNumber(player)}
        </Badge>
      </div>
      {!!droppedOutOn && (
        <div className="flex flex-col items-start gap-1 p-2 pt-0">
          <Badge variant="destructive">{`Out @ ${formatDateTime(droppedOutOn)}`}</Badge>
        </div>
      )}
      {substitutePlayer && (
        <div className="flex flex-col items-start gap-1 p-2 pt-0">
          <Badge>{`Substitute: ${getPlayerName(substitutePlayer)}`}</Badge>
        </div>
      )}
      {waitingForSub && (
        <div className="flex flex-col items-start gap-1 p-2 pt-0">
          <Badge variant="warning">{`Sub @ ${formatDateTime(addedOn)}`}</Badge>
        </div>
      )}
      {/* {!droppedOutOn && (
          <CardFooter className="flex max-h-20 flex-col items-stretch gap-2 overflow-hidden border-t p-1">
            <SkateDropOutButton
              className="ml-auto"
              player={player}
              skate={skate}
              position={position}
            />
          </CardFooter>
        )} */}
    </Card>
  );
};

export default SkateSpotCard;
