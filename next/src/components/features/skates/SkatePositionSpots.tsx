import { type Positions, type Skate } from "@db/features/skates/skates.type";
import SkateSpotCard from "./SkateSpotCard";
import SkateAddSubButton from "./SkateAddSubButton";
import { Card } from "@next/components/ui/card";
import { Badge } from "@next/components/ui/badge";
import {
  getSkatePlayersForPositionIn,
  getSkateTotalSpotsForPosition,
  getSkatePlayersForPositionOutWithoutSub,
  getSkatePlayersForPositionOutWithSub,
  getSkatePlayersForPositionSubsIn,
} from "@next/features/skates/skates.model";

type SkatePositionSpotsProps = {
  skate: Skate;
  position: Positions;
};

const SkatePositionSpots = ({ skate, position }: SkatePositionSpotsProps) => {
  const playersIn = getSkatePlayersForPositionIn(position, skate);
  const playersOutWithoutSubs = getSkatePlayersForPositionOutWithoutSub(
    position,
    skate,
  );
  const playersOutWithSubs = getSkatePlayersForPositionOutWithSub(
    position,
    skate,
  );
  const playerSubs = getSkatePlayersForPositionSubsIn(position, skate);
  const numPlayers = getSkateTotalSpotsForPosition(position, skate);

  return (
    <div className="my-4 grid grid-cols-2 items-stretch justify-stretch gap-2 md:grid-cols-4 lg:grid-cols-6">
      {Array.from({ length: numPlayers }).map((_, index) => {
        const playerToSkate = playersIn[index]
          ? playersIn[index]
          : playersOutWithoutSubs[index - playersIn.length];

        return (
          <div
            className="flex flex-1"
            key={playerToSkate?.id ?? `open-${index}`}
          >
            {!!playerToSkate && (
              <SkateSpotCard
                id={playerToSkate.id}
                className="flex-1"
                position={position}
                player={playerToSkate.player}
                skate={skate}
                addedOn={playerToSkate.addedOn}
                droppedOutOn={playerToSkate.droppedOutOn}
                substitutePlayer={playerToSkate.substitutePlayer}
                paid={playerToSkate.paid}
              />
            )}
            {!playerToSkate && (
              <Card className="flex flex-1 items-center justify-center p-4 font-semibold tracking-tight">
                <Badge variant="warning" className="flex items-center text-lg">
                  Open
                </Badge>
              </Card>
            )}
          </div>
        );
      })}
      <SkateAddSubButton skate={skate} position={position} />

      {playerSubs.map((playerToSkate) => (
        <SkateSpotCard
          key={playerToSkate.id}
          id={playerToSkate.id}
          position={position}
          player={playerToSkate.player}
          skate={skate}
          addedOn={playerToSkate.addedOn}
          droppedOutOn={playerToSkate.droppedOutOn}
          paid={playerToSkate.paid}
          waitingForSub
        />
      ))}

      {playersOutWithSubs.map((playerToSkate) => (
        <SkateSpotCard
          key={playerToSkate.id}
          id={playerToSkate.id}
          position={position}
          player={playerToSkate.player}
          skate={skate}
          addedOn={playerToSkate.addedOn}
          droppedOutOn={playerToSkate.droppedOutOn}
          paid={playerToSkate.paid}
          substitutePlayer={playerToSkate.substitutePlayer}
        />
      ))}
    </div>
  );
};

export default SkatePositionSpots;
