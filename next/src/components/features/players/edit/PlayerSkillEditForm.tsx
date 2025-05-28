"use client";

import { type Player } from "@db/features/players/players.type";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@next/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@next/components/ui/input";
import { api } from "@next/trpc/react";
import LoadingIndicator from "@next/components/LoadingIndicator";
import debounce from "debounce";

type PlayerSkillEditFormProps = {
  player: Player;
};

const FormSchema = z.object({
  skillLevel: z.preprocess(
    (a) => (a === "" ? null : parseInt(z.string().parse(a))),
    z.number().nullable(),
  ) as unknown as z.ZodNullable<z.ZodNumber>,
});

const PlayerSkillEditForm = ({ player }: PlayerSkillEditFormProps) => {
  const mutation = api.players.updateOne.useMutation();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      skillLevel: player.skillLevel,
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    mutation.mutate({
      playerId: player.id,
      ...data,
    });
  };

  return (
    <Form {...form}>
      <form className="relative flex" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="skillLevel"
          render={({ field }) => (
            <FormItem className="w-24 p-4">
              <FormLabel>Skill Level</FormLabel>
              <FormControl
                onChange={debounce(() => form.handleSubmit(onSubmit)(), 500)}
              >
                <Input
                  className="p-0 ps-2 text-xl"
                  {...field}
                  value={field.value ?? ""}
                  type="number"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {mutation.isPending && (
          <LoadingIndicator className="absolute top-1 left-1 size-4" />
        )}
      </form>
    </Form>
  );
};

export default PlayerSkillEditForm;
