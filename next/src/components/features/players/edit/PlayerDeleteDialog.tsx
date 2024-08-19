"use client";

import { type Player } from "@db/features/players/players.type";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@next/components/ui/dialog";
import { api } from "@next/trpc/react";
import ButtonLoading from "@next/components/ui/button-loading";
import { Button } from "@next/components/ui/button";
import { redirect, useRouter } from "next/navigation";

interface PlayerDeleteDialogProps {
  player: Player;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const PlayerDeleteDialog = ({
  player,
  open,
  setOpen,
}: PlayerDeleteDialogProps) => {
  const utils = api.useUtils();
  const router = useRouter();

  const deleteMutation = api.players.deleteOne.useMutation({
    onSuccess: async () => {
      await utils.players.getAll.invalidate();
      router.push("/players");
    },
  });

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(player);
  };
  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          This action cannot be undone. This will permanently delete this
          player.
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <ButtonLoading
            loading={deleteMutation.isPending}
            variant="destructive"
            onClick={handleDelete}
          >
            Delete
          </ButtonLoading>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerDeleteDialog;
