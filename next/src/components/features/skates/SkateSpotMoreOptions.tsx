import { Button } from "@next/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@next/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@next/components/ui/dialog";
import { api } from "@next/trpc/react";
import { MoreVerticalIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { type Skate } from "@db/features/skates/skates.type";
import ButtonLoading from "@next/components/ui/button-loading";

type SkateSpotMoreOptionsProps = {
  id: number;
  skate: Skate;
  onDelete?: () => void;
};

const SkateSpotMoreOptions = ({
  id,
  skate,
  onDelete,
}: SkateSpotMoreOptionsProps) => {
  const utils = api.useUtils();
  const [showDelete, setShowDelete] = useState<boolean>(false);

  const deleteMutation = api.skates.deleteSpot.useMutation({
    onSuccess: async () => {
      await utils.skates.getBySlugs.invalidate({
        skateSlug: skate.slug!,
        bookingSlug: skate.booking.slug!,
      });
      onDelete?.();
    },
  });

  const handleDelete = async () => {
    await deleteMutation.mutateAsync({
      id,
    });
  };

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
            <TrashIcon className=" size-4 text-red-500" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={showDelete} onOpenChange={(open) => setShowDelete(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            This action cannot be undone. This will permanently delete this
            player from the skate.
          </DialogDescription>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowDelete(false)}>
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
    </>
  );
};

export default SkateSpotMoreOptions;
