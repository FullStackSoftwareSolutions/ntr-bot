"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@next/components/ui/button";
import ButtonLoading from "@next/components/ui/button-loading";
import { Checkbox } from "@next/components/ui/checkbox";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Input } from "@next/components/ui/input";
import { Textarea } from "@next/components/ui/textarea";
import { api } from "@next/trpc/react";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  name: z.string().min(4, "Must be at least 4 characters"),
  announceName: z.string().min(4, "Must be at least 4 characters"),
  numPlayers: z.coerce.number().gt(0, "Must be greater than 0"),
  numGoalies: z.coerce.number().gt(0, "Must be greater than 0"),
  location: z.string(),
  cost: z.string(),
  scheduledTime: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  whatsAppGroupJid: z.string(),
  notifyGroup: z.boolean(),
});

const BookingAddDialog = ({}) => {
  const [open, setOpen] = useState(false);

  const utils = api.useUtils();
  const { mutate, isPending } = api.bookings.create.useMutation({
    onSuccess: async () => {
      await utils.bookings.getAll.invalidate();
      setOpen(false);
    },
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
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

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
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
          <form
            className="mt-2 flex flex-col gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="announceName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Announce name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numPlayers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel># of players</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numGoalies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel># of goalies</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="scheduledTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scheduled time</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start date</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End date</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="whatsAppGroupJid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp group jid</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notifyGroup"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-1">
                    <FormControl>
                      <Checkbox
                        {...field}
                        onCheckedChange={(checked) => field.onChange(checked)}
                        checked={field.value}
                        value={field.value ? "on" : "off"}
                      />
                    </FormControl>
                    <FormLabel>Notify group</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
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
