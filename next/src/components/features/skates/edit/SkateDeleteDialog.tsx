"use client";

import { type Skate } from "@db/features/skates/skates.type";
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
import { useRouter } from "next/navigation";

interface SkateDeleteDialogProps {
  skate: Skate;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SkateDeleteDialog = ({
  skate,
  open,
  setOpen,
}: SkateDeleteDialogProps) => {
  const utils = api.useUtils();
  const router = useRouter();

  const deleteMutation = api.skates.deleteOne.useMutation({
    onSuccess: async () => {
      await utils.skates.getAll.invalidate();
      router.push(`/booking/${skate.booking.slug}/skates`);
    },
  });

  const handleDelete = async () => {
    await deleteMutation.mutateAsync({ skateId: skate.id });
  };

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          This action cannot be undone. This will permanently delete this skate.
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

export default SkateDeleteDialog;
