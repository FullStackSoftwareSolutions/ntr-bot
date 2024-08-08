"use client";

import { type User } from "@db/features/users/users.type";
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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@next/components/ui/form";
import { Checkbox } from "@next/components/ui/checkbox";
import PlayerSelect from "../players/selects/PlayerSelect";

interface UserEditDialogProps {
  user: User;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const FormSchema = z.object({
  admin: z.boolean(),
  playerId: z.number().nullable(),
});
type FormType = z.infer<typeof FormSchema>;

const UserEditDialog = ({ user, open, setOpen }: UserEditDialogProps) => {
  const utils = api.useUtils();

  const updateMutation = api.users.updateOne.useMutation({
    onSuccess: async () => {
      await utils.users.getById.invalidate({
        id: user.id,
      });
    },
  });

  const form = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      admin: user.admin,
      playerId: user.player?.id ?? null,
    },
  });

  const onSubmit = async (data: FormType) => {
    await updateMutation.mutateAsync({
      id: user.id,
      ...data,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="mt-2 flex flex-col gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="admin"
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
                    <FormLabel>Admin</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="playerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Player</FormLabel>
                  <FormControl>
                    <PlayerSelect {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <ButtonLoading loading={updateMutation.isPending} type="submit">
                Update
              </ButtonLoading>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UserEditDialog;
