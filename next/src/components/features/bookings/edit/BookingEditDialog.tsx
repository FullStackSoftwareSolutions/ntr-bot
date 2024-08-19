"use client";

import { type BookingWithSkates } from "@db/features/bookings/bookings.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@next/components/ui/button";
import ButtonLoading from "@next/components/ui/button-loading";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@next/components/ui/dialog";
import { Form } from "@next/components/ui/form";
import { api } from "@next/trpc/react";
import { useForm } from "react-hook-form";
import BookingFields, {
  BookngFormFieldsSchema,
  type BookingFormFields,
} from "../create/BookingFields";
import { formatDateDb } from "@formatting/dates";

type BookingEditDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  booking: BookingWithSkates;
};

const BookingEditDialog = ({
  open,
  setOpen,
  booking,
}: BookingEditDialogProps) => {
  const utils = api.useUtils();
  const { mutate, isPending } = api.bookings.updateOne.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.bookings.getAll.invalidate(),
        utils.bookings.getBySlug.invalidate({
          slug: booking.slug!,
        }),
        utils.skates.getAllForBooking.invalidate({ bookingId: booking.id }),
      ]);
      setOpen(false);
    },
  });

  const form = useForm<BookingFormFields>({
    resolver: zodResolver(BookngFormFieldsSchema),
    defaultValues: {
      name: booking.name ?? "",
      announceName: booking.announceName ?? "",
      numPlayers: booking.numPlayers ?? "",
      numGoalies: booking.numGoalies ?? "",
      location: booking.location ?? "",
      cost: booking.cost ?? "",
      scheduledTime: booking.scheduledTime ?? "",
      startDate: booking.startDate ?? "",
      endDate: booking.endDate ?? "",
      dates: booking.skates.map((skate) => formatDateDb(skate.scheduledOn)),
      whatsAppGroupJid: booking.whatsAppGroupJid ?? "",
      notifyGroup: booking.notifyGroup,
    },
  });

  const onSubmit = async (data: BookingFormFields) => {
    mutate({
      bookingId: booking.id,
      ...data,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1">
            Edit Booking
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="mt-2" onSubmit={form.handleSubmit(onSubmit)}>
            <BookingFields
              control={form.control}
              watch={form.watch}
              setValue={form.setValue}
            />
            <DialogFooter className="mt-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <ButtonLoading type="submit" loading={isPending} size="sm">
                Save
              </ButtonLoading>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingEditDialog;
