"use client";

import { Button } from "@next/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@next/components/ui/dropdown-menu";
import { MoreVerticalIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { type Skate } from "@db/features/skates/skates.type";
import SkateDeleteDialog from "./edit/SkateDeleteDialog";

type SkateMoreOptionsProps = {
  skate: Skate;
};

const SkateMoreOptions = ({ skate }: SkateMoreOptionsProps) => {
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
            onClick={() => setShowDelete(true)}
            className="itmes-center flex gap-1 text-xs"
          >
            <TrashIcon className=" size-4 text-destructive" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <SkateDeleteDialog
        open={showDelete}
        setOpen={setShowDelete}
        skate={skate}
      />
    </>
  );
};

export default SkateMoreOptions;
