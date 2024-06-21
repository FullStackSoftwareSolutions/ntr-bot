"use client";

import { type Booking } from "@db/features/bookings/bookings.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@next/components/ui/button";
import { Card, CardTitle } from "@next/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@next/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@next/components/ui/form";
import { api } from "@next/trpc/react";
import { DialogClose } from "@radix-ui/react-dialog";
import { ArrowRightIcon, PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import BookingAddPlayerSelect from "./selects/BookingAddPlayerSelect";
import { type Positions } from "@db/features/skates/skates.type";

type BookingAddPlayerButtonProps = {
  booking: Booking;
  position: Positions;
};

const FormSchema = z.object({
  playerId: z.number(),
});

const BookingAddPlayerButton = ({
  booking,
  position,
}: BookingAddPlayerButtonProps) => {
  const utils = api.useUtils();
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = api.bookings.addPlayer.useMutation({
    onSuccess: async () => {
      await utils.bookings.getBySlug.invalidate({
        slug: booking.slug!,
      });
      handleOpenChange(false);
    },
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      form.reset();
    }
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    mutate({
      bookingId: booking.id,
      playerId: data.playerId,
      position,
    });
  };
  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="flex h-auto items-stretch justify-stretch overflow-hidden p-0.5"
        >
          <Card className="flex flex-1 flex-col items-center justify-center p-0.5 hover:bg-card/90">
            <CardTitle className="flex flex-1 items-center justify-center gap-4 p-6 py-4">
              <PlusIcon size={24} className="text-secondary" />
              <div className="flex flex-wrap gap-2">
                <p>Add</p>
                <p>{position}</p>
              </div>
            </CardTitle>
          </Card>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {booking.name}
            <ArrowRightIcon />
            Add {position}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="mt-2 flex flex-col gap-8"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="playerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{position}</FormLabel>
                  <FormControl>
                    <BookingAddPlayerSelect
                      booking={booking}
                      position={position}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex gap-2">
              <DialogClose asChild>
                <Button variant="outline" type="reset" disabled={isPending}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                Add {position}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingAddPlayerButton;
