"use client";

import { Button } from "@next/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@next/components/ui/dropdown-menu";
import { EditIcon, MoreVerticalIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { type Player } from "@db/features/players/players.type";
import PlayerEditDialog from "./edit/PlayerEditDialog";
import PlayerDeleteDialog from "./edit/PlayerDeleteDialog";

type PlayerMoreOptionsProps = {
  player: Player;
};

const PlayerMoreOptions = ({ player }: PlayerMoreOptionsProps) => {
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-auto px-0.5 py-0.5">
            <MoreVerticalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={() => setShowEdit(true)}
            className="itmes-center flex gap-1 text-xs"
          >
            <EditIcon className=" size-4 text-secondary" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDelete(true)}
            className="itmes-center flex gap-1 text-xs"
          >
            <TrashIcon className=" size-4 text-destructive" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <PlayerDeleteDialog
        open={showDelete}
        setOpen={setShowDelete}
        player={player}
      />
      <PlayerEditDialog open={showEdit} setOpen={setShowEdit} player={player} />
    </>
  );
};

export default PlayerMoreOptions;
