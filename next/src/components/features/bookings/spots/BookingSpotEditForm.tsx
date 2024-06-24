import { type Booking } from "@db/features/bookings/bookings.type";
import { zodResolver } from "@hookform/resolvers/zod";
import ButtonLoading from "@next/components/ui/button-loading";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@next/components/ui/form";
import { InputCurrency } from "@next/components/ui/input-currency";
import { cn } from "@next/lib/utils";
import { api } from "@next/trpc/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type BookingSpotEditFormProps = {
  id: number;
  booking: Booking;
  amountPaid: string | null;
  className?: string;
};

const BookingSpotFormSchema = z.object({
  amountPaid: z.string(),
});

type BookingSpotFormFields = z.infer<typeof BookingSpotFormSchema>;

const BookingSpotEditForm = ({
  id,
  booking,
  className,
  amountPaid,
}: BookingSpotEditFormProps) => {
  const utils = api.useUtils();
  const form = useForm<BookingSpotFormFields>({
    resolver: zodResolver(BookingSpotFormSchema),
    defaultValues: {
      amountPaid: amountPaid ?? "",
    },
  });

  const { mutate, isPending } = api.bookings.updatePlayer.useMutation({
    onSuccess: async (updatedSpot) => {
      await Promise.all([
        utils.bookings.getBySlug.invalidate({
          slug: booking.slug!,
        }),
        utils.skates.getAllForBooking.invalidate({ bookingId: booking.id }),
      ]);

      form.reset({
        amountPaid: updatedSpot?.amountPaid ?? "",
      });
    },
  });

  const onSubmit = async (data: BookingSpotFormFields) => {
    mutate({
      playerBookingId: id,
      ...data,
    });
  };

  return (
    <Form {...form}>
      <form
        className={cn("flex items-end gap-4", className)}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="amountPaid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount paid</FormLabel>
              <FormControl>
                <InputCurrency {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ButtonLoading type="submit" loading={isPending} size="sm">
          Save
        </ButtonLoading>
      </form>
    </Form>
  );
};

export default BookingSpotEditForm;
