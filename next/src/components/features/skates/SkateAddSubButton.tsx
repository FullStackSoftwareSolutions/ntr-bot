"use client";

import { type Skate } from "@db/features/skates/skates.type";
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
import {
  getSkateTimeMessage,
  type Positions,
} from "@next/features/skates/skates.model";
import { api } from "@next/trpc/react";
import { DialogClose } from "@radix-ui/react-dialog";
import { ArrowRightIcon, PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SkateSubPlayerSelect from "./selects/SkateSubPlayerSelect";
import { useState } from "react";

type SkateAddSubButtonProps = {
  skate: Skate;
  position: Positions;
};

const FormSchema = z.object({
  playerId: z.number(),
});

const SkateAddSubButton = ({ skate, position }: SkateAddSubButtonProps) => {
  const utils = api.useUtils();
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = api.skates.subInPlayer.useMutation({
    onSuccess: async () => {
      await utils.skates.getBySlugs.invalidate({
        skateSlug: skate.slug!,
        bookingSlug: skate.booking.slug!,
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
      skateId: skate.id,
      playerId: data.playerId,
      position,
    });
  };
  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="flex h-auto items-stretch justify-stretch p-0.5"
        >
          <Card className="flex flex-1 flex-col items-center justify-center p-0.5 hover:bg-card/90">
            <CardTitle className="flex  flex-1 items-center justify-center gap-2 p-6">
              <PlusIcon size={24} className="text-secondary" /> Add Sub
            </CardTitle>
          </Card>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getSkateTimeMessage(skate)}
            <ArrowRightIcon />
            Add Sub
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
                  <FormLabel>Player</FormLabel>
                  <FormControl>
                    <SkateSubPlayerSelect
                      skate={skate}
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
                Sub In
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SkateAddSubButton;
