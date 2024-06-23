"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@next/components/ui/button";
import ButtonLoading from "@next/components/ui/button-loading";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@next/components/ui/dialog";
import { Form } from "@next/components/ui/form";
import { api } from "@next/trpc/react";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import BookingFields, {
  type BookingFormFields,
  BookngFormFieldsSchema,
} from "./BookingFields";
import { useRouter } from "next/navigation";

const BookingAddDialog = ({}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const utils = api.useUtils();
  const { mutate, isPending } = api.bookings.create.useMutation({
    onSuccess: async (booking) => {
      await utils.bookings.getAll.invalidate();
      setOpen(false);
      router.push(`/booking/${booking.slug}`);
    },
  });

  const form = useForm<BookingFormFields>({
    resolver: zodResolver(BookngFormFieldsSchema),
    defaultValues: {
      name: "",
      announceName: "",
      numPlayers: 12,
      numGoalies: 2,
      location: "",
      cost: "",
      scheduledTime: "",
      startDate: "",
      endDate: "",
      whatsAppGroupJid: "",
      notifyGroup: true,
    },
  });

  const onSubmit = async (data: BookingFormFields) => {
    mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon />
          Add
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1">
            Add Booking
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="mt-2" onSubmit={form.handleSubmit(onSubmit)}>
            <BookingFields control={form.control} />
            <DialogFooter className="mt-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <ButtonLoading type="submit" loading={isPending} size="sm">
                Create
              </ButtonLoading>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingAddDialog;
