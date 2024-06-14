import dayjs from "dayjs";
import dayjsCalendarPlugin from "dayjs/plugin/calendar";
import { DATE_FORMAT } from ".";

dayjs.extend(dayjsCalendarPlugin);

export const formatDateRelative = (date: Date) => {
  return dayjs(date).calendar(dayjs(), {
    sameDay: "[Today]", // The same day ( Today at 2:30 AM )
    nextDay: "[Tomorrow]", // The next day ( Tomorrow at 2:30 AM )
    nextWeek: "[Next] dddd", // The next week ( Sunday at 2:30 AM )
    lastDay: "[Yesterday]", // The day before ( Yesterday at 2:30 AM )
    lastWeek: "[Last] dddd", // Last week ( Last Monday at 2:30 AM )
    sameElse: "dddd", // Everything else ( 17/10/2011 )
  });
};

export const getDatesBetween = (
  startDate: Date | string,
  endDate: Date | string,
  unit: dayjs.ManipulateType = "week"
) => {
  const dates = [];

  let date = dayjs(startDate);
  while (!date.isAfter(endDate)) {
    dates.push(date.toDate());

    date = date.add(1, unit);
  }

  return dates;
};
