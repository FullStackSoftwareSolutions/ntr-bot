"use client";

import { type Player } from "@db/features/players/players.type";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@next/components/ui/dialog";
import { api } from "@next/trpc/react";
import ButtonLoading from "@next/components/ui/button-loading";
import { Button } from "@next/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@next/components/ui/form";
import PlayerFields, {
  type PlayerFormFields,
  usePlayerFormSchema,
} from "../create/PlayerFields";
import { useRouter } from "next/navigation";

interface PlayerEditDialogProps {
  player: Player;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const PlayerEditDialog = ({ player, open, setOpen }: PlayerEditDialogProps) => {
  const utils = api.useUtils();
  const router = useRouter();

  const { mutate, isPending } = api.players.updateOne.useMutation({
    onSuccess: async (data) => {
      await utils.players.getById.invalidate({
        id: player.id,
      });
      if (player.email) {
        await utils.players.getByEmail.invalidate({
          email: player.email,
        });
      }

      if (player.email !== data.email) {
        if (data.email) {
          return router.push(`/player/${data.email}`);
        }
        return router.push(`/player/${data.id}`);
      }
    },
  });

  const PlayerFormFieldsSchema = usePlayerFormSchema(player);

  const form = useForm<PlayerFormFields>({
    resolver: zodResolver(PlayerFormFieldsSchema, undefined, { mode: "async" }),
    defaultValues: {
      fullName: player.fullName ?? "",
      nickname: player.nickname ?? "",
      email: player.email ?? "",
      phoneNumber: player.phoneNumber ?? "",
      skillLevel: (player.skillLevel?.toString() ?? "") as unknown as number,
      isPlayer: player.isPlayer ?? false,
      isGoalie: player.isGoalie ?? false,
      notes: player.notes ?? "",
    },
  });

  const onSubmit = async (data: PlayerFormFields) => {
    mutate({
      playerId: player.id,
      fullName: data.fullName,
      nickname: data.nickname || null,
      email: data.email?.toLowerCase() || null,
      phoneNumber: data.phoneNumber || null,
      skillLevel: Number(data.skillLevel) || null,
      isPlayer: data.isPlayer,
      isGoalie: data.isGoalie,
      notes: data.notes || null,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Player</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="mt-2 flex flex-col gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <PlayerFields control={form.control} trigger={form.trigger} />
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                size="sm"
              >
                Cancel
              </Button>
              <ButtonLoading loading={isPending} type="submit" size="sm">
                Update
              </ButtonLoading>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerEditDialog;
