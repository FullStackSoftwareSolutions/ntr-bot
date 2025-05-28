import { type Player } from "@db/features/players/players.type";
import { Badge } from "@next/components/ui/badge";
import { Button } from "@next/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@next/components/ui/card";
import {
  getPlayerName,
  getPlayerSkillNumber,
} from "@next/features/players/players.model";
import { cn } from "@next/lib/utils";
import Link from "next/link";

type PlayerCardProps = {
  className?: string;
  player: Player;
};

const PlayerCard = ({ className, player }: PlayerCardProps) => {
  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "bg-secondary/40 hover:bg-secondary dark:hover:bg-secondary h-auto w-full rounded-lg border p-0.5 text-start sm:w-64",
        className,
      )}
    >
      <Link href={`/player/${encodeURIComponent(player.email ?? player.id)}`}>
        <Card className="hover:bg-card/90 h-full w-full overflow-hidden">
          <CardHeader>
            <CardTitle className="flex flex-wrap items-start gap-2 text-xl whitespace-pre-wrap">
              {getPlayerName(player)}
              <Badge variant="secondary" className="ml-auto">
                {getPlayerSkillNumber(player)}
              </Badge>
            </CardTitle>
            <div className="flex flex-col gap-4">
              <div className="my-1 flex gap-1">
                {player.isGoalie && <Badge variant="outline">Goalie</Badge>}
                {player.isPlayer && <Badge variant="outline">Player</Badge>}
              </div>
              <div className="text-foreground/40">
                <p>{player.email}</p>
                <p>{player.phoneNumber}</p>
              </div>
            </div>
          </CardHeader>
          {player.notes && (
            <CardContent className="flex flex-col gap-2">
              <p>{player.notes}</p>
            </CardContent>
          )}
        </Card>
      </Link>
    </Button>
  );
};

export default PlayerCard;
