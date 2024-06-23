import { Checkbox } from "@next/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@next/components/ui/form";
import { Input } from "@next/components/ui/input";
import { type Control } from "react-hook-form";
import { z } from "zod";
import WhatsAppGroupSelect from "../../whatsapp/selects/WhatsAppGroupSelect";
import { InputCurrency } from "@next/components/ui/input-currency";
import InputDate from "@next/components/ui/input-date";

export const BookngFormFieldsSchema = z.object({
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

export type BookingFormFields = z.infer<typeof BookngFormFieldsSchema>;

type BookingFieldsProps = {
  control: Control<BookingFormFields>;
};

const BookingFields = ({ control }: BookingFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="announceName"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>Announce name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
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
        control={control}
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
        control={control}
        name="cost"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>Cost</FormLabel>
            <FormControl>
              <InputCurrency {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
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
        control={control}
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
        control={control}
        name="startDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Start date</FormLabel>
            <FormControl>
              <InputDate {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="endDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>End date</FormLabel>
            <FormControl>
              <InputDate {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="whatsAppGroupJid"
        render={({ field }) => (
          <FormItem>
            <FormLabel>WhatsApp group</FormLabel>
            <FormControl>
              <WhatsAppGroupSelect {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
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
    </div>
  );
};

export default BookingFields;
