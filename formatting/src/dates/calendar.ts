import dayjs from "dayjs";
import dayjsCalendarPlugin from "dayjs/plugin/calendar";

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

  let from = dayjs(startDate);
  let to = dayjs(endDate);
  if (!from.isValid() || !to.isValid()) {
    return [];
  }

  while (!from.isAfter(to)) {
    dates.push(from.toDate());

    from = from.add(1, unit);
  }

  return dates;
};
