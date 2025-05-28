"use client";

import { type Skate } from "@db/features/skates/skates.type";
import { Button } from "@next/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@next/components/ui/card";
import {
  getSkateGoaliesIn,
  getSkatePlayersIn,
  getSkateTimeMessage,
} from "@next/features/skates/skates.model";
import Link from "next/link";
import { formatDateRelative } from "@formatting/dates/calendar";
import SkateOpenSpots from "./SkateOpenSpots";
import { getPlayerName } from "@next/features/players/players.model";
import { cn } from "@next/lib/utils";

type SkateCardProps = {
  className?: string;
  skate: Skate;
};

const SkateCard = ({ skate, className }: SkateCardProps) => {
  const players = getSkatePlayersIn(skate);
  const goalies = getSkateGoaliesIn(skate);

  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "bg-secondary/40 hover:bg-secondary dark:hover:bg-secondary h-auto w-full rounded-lg border p-0.5 text-start sm:w-64",
        className,
      )}
    >
      <Link href={`/booking/${skate.booking.slug}/skate/${skate.slug}`}>
        <Card className="h-full w-full">
          <CardHeader>
            <CardTitle className="text-xl">
              {getSkateTimeMessage(skate)}
            </CardTitle>
            <CardDescription>
              {formatDateRelative(skate.scheduledOn)}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-start gap-4">
            <SkateOpenSpots skate={skate} />
            <div className="flex flex-col">
              <h3 className="text-xl">Players</h3>
              <ul className="m-4 flex flex-col">
                {players.map(({ player }) => (
                  <li key={player.id}>{getPlayerName(player)}</li>
                ))}
              </ul>
              <h3 className="text-xl">Goalies</h3>
              <ul className="m-4 flex flex-col">
                {goalies.map(({ player }) => (
                  <li key={player.id}>{getPlayerName(player)}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </Link>
    </Button>
  );
};

export default SkateCard;
