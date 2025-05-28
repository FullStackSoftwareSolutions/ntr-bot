import { Checkbox } from "@next/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@next/components/ui/form";
import { Input } from "@next/components/ui/input";
import { type UseFormTrigger, type Control } from "react-hook-form";
import { z } from "zod";
import { apiClient } from "@next/trpc/react";
import { Textarea } from "@next/components/ui/textarea";
import { type Player } from "@db/features/players/players.type";

export const usePlayerFormSchema = (player?: Player) => {
  return z
    .object({
      fullName: z.string().min(2),
      nickname: z.string().optional(),
      email: z
        .preprocess((a) => (a === "" ? null : a), z.string().email().nullable())
        .refine(
          async (email) => {
            if (!email) return true;

            const isValidEmail = await apiClient.players.canUseEmail.query({
              email,
              playerId: player?.id,
            });

            return isValidEmail;
          },
          { message: "Email already in use" },
        ) as unknown as z.ZodNullable<z.ZodString>,
      phoneNumber: z.string(),
      skillLevel: z.preprocess(
        (a) => (a === "" ? null : parseInt(z.string().parse(a))),
        z.number(),
      ) as unknown as z.ZodNumber,
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
};

export type PlayerFormFields = z.infer<ReturnType<typeof usePlayerFormSchema>>;

type PlayerFieldsProps = {
  control: Control<PlayerFormFields>;
  trigger: UseFormTrigger<PlayerFormFields>;
  player?: Player;
};

const PlayerFields = ({ control, trigger, player }: PlayerFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={control}
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
        control={control}
        name="nickname"
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
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value ?? ""}
                onChange={(...props) => {
                  field.onChange(...props);
                  return trigger("email");
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
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
        control={control}
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
          control={control}
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
          control={control}
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
        control={control}
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
    </div>
  );
};

export default PlayerFields;
