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

const FormSchema = z
  .object({
    fullName: z.string().min(2),
    nickName: z.string().optional(),
    email: z.string().email(),
    phoneNumber: z.string(),
    skillLevel: z.preprocess(
      (a) => (a === "" ? null : parseInt(z.string().parse(a))),
      z.number(),
    ),
    isPlayer: z.boolean(),
    isGoalie: z.boolean(),
    notes: z.string().optional(),
  })
  .refine(
    (schema) => {
      if (!schema.isPlayer && !schema.isGoalie) {
        return false;
      }
      return true;
    },
    { path: ["isPlayer"], message: "Must be a player or goalie" },
  );

const PlayerAddDialog = ({}) => {
  const [open, setOpen] = useState(false);

  const utils = api.useUtils();
  const { mutate, isPending } = api.players.create.useMutation({
    onSuccess: async () => {
      await utils.players.getAll.invalidate();
      setOpen(false);
    },
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullName: "",
      nickName: "",
      email: "",
      phoneNumber: "",
      skillLevel: "" as unknown as number,
      isPlayer: false,
      isGoalie: false,
      notes: "",
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
            Add Player
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="mt-2 flex flex-col gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nickName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nickname</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone #</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="skillLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skill level</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="isPlayer"
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
                      <FormLabel>Is Player</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isGoalie"
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
                      <FormLabel>Is Goalie</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
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

export default PlayerAddDialog;
