import { type Player } from "@db/features/players/players.type";
import { type Skate } from "@db/features/skates/skates.type";
import { getPlayerName } from "@next/features/players/players.model";
import {
  getSkateGoaliesIn,
  getSkatePlayersIn,
} from "@next/features/skates/skates.model";

type SkateFilledSpotsProps = {
  skate: Skate;
};

const SkateFilledSpots = ({ skate }: SkateFilledSpotsProps) => {
  const players = getSkatePlayersIn(skate);
  const goalies = getSkateGoaliesIn(skate);

  return (
    <div className="">
      <h3 className="text-xl">Players</h3>
      <ul className="m-4">
        {players.map(({ player }) => (
          <li key={player.id}>
            <SkateFilledSpot player={player} />
          </li>
        ))}
      </ul>
      <h3 className="text-xl">Goalies</h3>
      <ul className="m-4">
        {goalies.map(({ player }) => (
          <li key={player.id}>
            <SkateFilledSpot player={player} />
          </li>
        ))}
      </ul>
    </div>
  );
};

type SkateFilledSpotProps = {
  player: Player;
};

const SkateFilledSpot = ({ player }: SkateFilledSpotProps) => (
  <div>
    <span>{getPlayerName(player)}</span>
  </div>
);

export default SkateFilledSpots;
