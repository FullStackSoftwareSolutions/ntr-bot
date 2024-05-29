import { type Skate } from "@db/features/skates/skates.type";
import SkateSpotCard from "./SkateSpotCard";
import SkateAddSubButton from "./SkateAddSubButton";
import { Card } from "@next/components/ui/card";
import { Badge } from "@next/components/ui/badge";
import {
  getSkatePlayersForPositionIn,
  getSkateTotalSpotsForPosition,
  getSkatePlayersForPositionOutWithoutSub,
  type Positions,
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

  console.log(playersOutWithoutSubs);

  return (
    <div className="m-4 grid grid-cols-2 items-stretch justify-stretch gap-2 md:grid-cols-4 lg:grid-cols-6">
      {Array.from({ length: numPlayers }).map((_, index) => {
        const playerToSkate = playersIn[index]
          ? playersIn[index]
          : playersOutWithoutSubs[index - playersIn.length];

        return (
          <>
            {!!playerToSkate && (
              <SkateSpotCard
                key={playerToSkate.id}
                id={playerToSkate.id}
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
              <Card className="flex items-center justify-center p-4 font-semibold tracking-tight">
                <Badge variant="warning" className="flex items-center text-lg">
                  Open
                </Badge>
              </Card>
            )}
          </>
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
