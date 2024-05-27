import { type Skate } from "@db/features/skates/skates.type";
import { Positions } from "@next/features/skates/skates.model";
import SkatePositionSpots from "./SkatePositionSpots";

type SkateSpotsProps = {
  skate: Skate;
};

const SkateSpots = ({ skate }: SkateSpotsProps) => {
  return (
    <div className="flex flex-col">
      <h3 className="self-start text-2xl">Players</h3>
      <SkatePositionSpots skate={skate} position={Positions.Player} />
      <h3 className="self-start text-2xl">Goalies</h3>
      <SkatePositionSpots skate={skate} position={Positions.Goalie} />
    </div>
  );
};

export default SkateSpots;
