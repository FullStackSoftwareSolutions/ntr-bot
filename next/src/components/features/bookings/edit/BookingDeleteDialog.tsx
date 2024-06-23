"use client";

import { type Booking } from "@db/features/bookings/bookings.type";
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
import { router } from "@whatsapp/trpc/server";

interface BookingDeleteDialogProps {
  booking: Booking;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const BookingDeleteDialog = ({
  booking,
  open,
  setOpen,
}: BookingDeleteDialogProps) => {
  const utils = api.useUtils();
  const router = useRouter();

  const deleteMutation = api.bookings.deleteOne.useMutation({
    onSuccess: async () => {
      await utils.bookings.getAll.invalidate();
      router.push("/bookings");
    },
  });

  const handleDelete = async () => {
    await deleteMutation.mutateAsync({ bookingId: booking.id });
  };
  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          This action cannot be undone. This will permanently delete this
          booking.
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

export default BookingDeleteDialog;
