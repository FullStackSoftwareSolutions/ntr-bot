import { Checkbox } from "@next/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@next/components/ui/form";
import { Input } from "@next/components/ui/input";
import {
  type UseFormSetValue,
  type UseFormWatch,
  type Control,
} from "react-hook-form";
import { z } from "zod";
import WhatsAppGroupSelect from "../../whatsapp/selects/WhatsAppGroupSelect";
import { InputCurrency } from "@next/components/ui/input-currency";
import InputDate from "@next/components/ui/input-date";
import { getDatesBetween } from "@formatting/dates/calendar";
import { formatDate, formatDateDb } from "@formatting/dates";
import { BadgeToggle } from "@next/components/ui/badge-toggle";

export const BookngFormFieldsSchema = z.object({
  name: z.string().min(4, "Must be at least 4 characters"),
  announceName: z.string().min(4, "Must be at least 4 characters"),
  numPlayers: z.coerce.number().gt(0, "Must be greater than 0"),
  numGoalies: z.coerce.number().gt(0, "Must be greater than 0"),
  location: z.string(),
  cost: z.string(),
  costPerPlayer: z.string(),
  costPerPlayerPerSkate: z.string(),
  scheduledTime: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  dates: z.array(z.string()),
  whatsAppGroupJid: z.string(),
  notifyGroup: z.boolean(),
});

export type BookingFormFields = z.infer<typeof BookngFormFieldsSchema>;

type BookingFieldsProps = {
  control: Control<BookingFormFields>;
  watch: UseFormWatch<BookingFormFields>;
  setValue: UseFormSetValue<BookingFormFields>;
};

const BookingFields = ({ control, watch, setValue }: BookingFieldsProps) => {
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const dates = watch("dates");

  const availableDates = getDatesBetween(startDate, endDate);

  const updateDates = ({
    startDate: newStartDate,
    endDate: newEndDate,
  }: {
    startDate: string;
    endDate: string;
  }) => {
    const newDates = getDatesBetween(newStartDate, newEndDate);
    const newDatesString = newDates.map((date) => formatDateDb(date));
    const filteredDates = newDatesString.filter((date) => {
      if (startDate === "" || endDate === "") {
        return true;
      }

      return (
        dates.includes(date) ||
        new Date(date) < new Date(startDate) ||
        new Date(date) > new Date(endDate)
      );
    });

    setValue("dates", filteredDates);
  };

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
        name="costPerPlayer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cost Per Player</FormLabel>
            <FormControl>
              <InputCurrency {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="costPerPlayerPerSkate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cost Per Player Per Skate</FormLabel>
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
      <div className="col-span-2 grid grid-cols-2 gap-x-4 gap-y-2">
        <FormField
          control={control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start date</FormLabel>
              <FormControl>
                <InputDate
                  {...field}
                  onChange={(val) => {
                    field.onChange(val);
                    updateDates({ startDate: val, endDate });
                  }}
                />
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
                <InputDate
                  {...field}
                  onChange={(val) => {
                    field.onChange(val);
                    updateDates({ startDate, endDate: val });
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-2 max-h-20 overflow-y-auto">
          <FormField
            control={control}
            name="dates"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="grid grid-cols-3 gap-1 md:grid-cols-5 ">
                    {availableDates.map((date) => {
                      const dateString = formatDateDb(date);
                      const checked = field.value.includes(dateString);
                      return (
                        <BadgeToggle
                          className="w-full"
                          key={dateString}
                          checked={checked}
                          {...field}
                          onClick={() => {
                            if (checked) {
                              field.onChange(
                                field.value.filter((d) => d !== dateString),
                              );
                            } else {
                              field.onChange([...field.value, dateString]);
                            }
                          }}
                        >
                          {formatDate(date)}
                        </BadgeToggle>
                      );
                    })}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
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
            <div className="flex items-center gap-2 py-1">
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
