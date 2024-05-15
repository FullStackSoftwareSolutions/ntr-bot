import { type Player } from "@db/features/players/players.type";
import { Badge } from "@next/components/ui/badge";
import { Button } from "@next/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@next/components/ui/card";
import {
  getPlayerName,
  getPlayerSkillNumber,
} from "@next/features/players/players.model";
import Link from "next/link";

type PlayerCardProps = {
  player: Player;
};

const PlayerCard = ({ player }: PlayerCardProps) => {
  return (
    <Button asChild variant="ghost" className="h-auto p-0.5 text-start">
      <Link href={`/player/${encodeURIComponent(player.email ?? player.id)}`}>
        <Card className="w-full overflow-hidden hover:bg-card/90 sm:w-64">
          <CardHeader>
            <CardTitle className="flex flex-wrap items-start gap-2 whitespace-pre-wrap">
              {getPlayerName(player)}
              <Badge variant="secondary" className="ml-auto">
                {getPlayerSkillNumber(player)}
              </Badge>
            </CardTitle>
            <CardDescription className="flex flex-col gap-4">
              <div className="my-1 flex gap-1">
                {player.isGoalie && <Badge variant="outline">Goalie</Badge>}
                {player.isPlayer && <Badge variant="outline">Player</Badge>}
              </div>
              <div className="text-foreground/40">
                <p>{player.email}</p>
                <p>{player.phoneNumber}</p>
              </div>
            </CardDescription>
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
