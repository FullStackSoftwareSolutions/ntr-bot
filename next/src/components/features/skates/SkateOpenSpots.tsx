import { type Skate } from "@db/features/skates/skates.type";
import { Badge } from "@next/components/ui/badge";
import {
  getSkateNumGoalieSpotsOpen,
  getSkateNumPlayerSpotsOpen,
} from "@next/features/skates/skates.model";
import { TriangleAlertIcon } from "lucide-react";

type SkateOpenSpotsProps = {
  skate: Skate;
};

const SkateOpenSpots = ({ skate }: SkateOpenSpotsProps) => {
  const numGoalieSpotsOpen = getSkateNumGoalieSpotsOpen(skate);
  const numPlayerSpotsOpen = getSkateNumPlayerSpotsOpen(skate);

  return (
    <div className="flex flex-col items-start gap-1">
      {numGoalieSpotsOpen > 0 && (
        <Badge
          variant="destructive"
          className="flex items-center gap-2 text-sm"
        >
          <TriangleAlertIcon />
          {numGoalieSpotsOpen} goalie spot
          {numGoalieSpotsOpen > 1 ? "s" : ""} open
        </Badge>
      )}
      {numPlayerSpotsOpen > 0 && (
        <Badge variant="warning" className="flex items-center gap-2 text-sm">
          <TriangleAlertIcon />
          {numPlayerSpotsOpen} player spot
          {numPlayerSpotsOpen > 1 ? "s" : ""} open
        </Badge>
      )}
    </div>
  );
};

export default SkateOpenSpots;
