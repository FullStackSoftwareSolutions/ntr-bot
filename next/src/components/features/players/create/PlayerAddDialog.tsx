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
import PlayerFields, {
  usePlayerFormSchema,
  type PlayerFormFields,
} from "./PlayerFields";

const PlayerAddDialog = ({}) => {
  const [open, setOpen] = useState(false);

  const utils = api.useUtils();
  const { mutate, isPending } = api.players.create.useMutation({
    onSuccess: async () => {
      await utils.players.getAll.invalidate();
      setOpen(false);
    },
  });

  const PlayerFormFieldsSchema = usePlayerFormSchema();
  const form = useForm<PlayerFormFields>({
    resolver: zodResolver(PlayerFormFieldsSchema, undefined, { mode: "async" }),
    defaultValues: {
      fullName: "",
      nickname: "",
      email: "",
      phoneNumber: "",
      skillLevel: "" as unknown as number,
      isPlayer: false,
      isGoalie: false,
      notes: "",
    },
  });

  const onSubmit = async (data: PlayerFormFields) => {
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
            Add Player
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="mt-2 flex flex-col gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <PlayerFields control={form.control} trigger={form.trigger} />
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

export default PlayerAddDialog;
