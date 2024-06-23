"use client";

import { type SelectSingleEventHandler } from "react-day-picker";
import { format, isValid, parse } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@next/components/ui/button";
import { Calendar } from "@next/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@next/components/ui/popover";
import { Input, type InputProps } from "@next/components/ui/input";
import { cn } from "@next/lib/utils";
import { useEffect, useState } from "react";

export type InputDateProps = {
  onChange: (val: string) => void;
  value: string | undefined;
};

export default function InputDate({ onChange, value }: InputDateProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>();

  useEffect(() => {
    const date = value ? parse(value, "y-MM-dd", new Date()) : undefined;
    setDate(date);
  }, [value]);

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const date = parse(e.currentTarget.value, "y-MM-dd", new Date());
    if (isValid(date)) {
      setDate(date);
    } else {
      setDate(undefined);
    }

    onChange(e.target.value);
  };

  const handleSelectDate: SelectSingleEventHandler = (selected) => {
    setDate(selected);
    if (selected) {
      setOpen(false);
      onChange(format(selected, "y-MM-dd"));
    } else {
      onChange("");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <fieldset className="relative">
        <Input
          placeholder="YYYY-MM-DD"
          value={value}
          onChange={handleInputChange}
        />
        <PopoverTrigger asChild>
          <Button
            aria-label="Pick a date"
            variant="outline"
            className={cn(
              "absolute right-1.5 top-1/2 h-7 -translate-y-1/2 rounded-sm border px-2 font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
      </fieldset>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          defaultMonth={date}
          selected={date}
          onSelect={handleSelectDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
