"use client";

import { type User } from "@db/features/users/users.type";
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

interface UserDeleteDialogProps {
  user: User;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const UserDeleteDialog = ({ user, open, setOpen }: UserDeleteDialogProps) => {
  const utils = api.useUtils();

  const deleteMutation = api.users.deleteOne.useMutation({
    onSuccess: async () => {
      await utils.users.getAll.invalidate();
    },
  });

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(user);
  };
  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          This action cannot be undone. This will permanently delete this user.
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

export default UserDeleteDialog;
