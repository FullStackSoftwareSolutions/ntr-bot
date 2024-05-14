import { type Skate } from "@db/features/skates/skates.type";
import {
  getSkatePlayersForPosition,
  Positions,
} from "@next/features/skates/skates.model";
import SkateSpotCard from "./SkateSpotCard";
import SkateAddSubButton from "./SkateAddSubButton";

type SkateFilledSpotsProps = {
  skate: Skate;
};

const SkateFilledSpots = ({ skate }: SkateFilledSpotsProps) => {
  const players = getSkatePlayersForPosition(Positions.Player, skate);
  const goalies = getSkatePlayersForPosition(Positions.Goalie, skate);

  return (
    <div className="flex flex-col items-start">
      <h3 className="text-xl">Players</h3>
      <div className="m-4 flex flex-wrap items-stretch justify-stretch gap-2">
        {players.map(({ player, droppedOutOn }) => (
          <SkateSpotCard
            key={player.id}
            position={Positions.Player}
            player={player}
            skate={skate}
            droppedOutOn={droppedOutOn}
          />
        ))}
        <SkateAddSubButton skate={skate} position={Positions.Player} />
      </div>
      <h3 className="text-xl">Goalies</h3>
      <div className="m-4 flex flex-wrap items-stretch justify-stretch gap-2">
        {goalies.map(({ player, droppedOutOn }) => (
          <SkateSpotCard
            key={player.id}
            position={Positions.Goalie}
            player={player}
            skate={skate}
            droppedOutOn={droppedOutOn}
          />
        ))}
        <SkateAddSubButton skate={skate} position={Positions.Goalie} />
      </div>
    </div>
  );
};

export default SkateFilledSpots;
