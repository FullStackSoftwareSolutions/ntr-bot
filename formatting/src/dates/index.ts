import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";
import { timeToEmoji } from "@formatting/time";

dayjs.extend(utc);
dayjs.extend(timezone);

const localTimezone = dayjs.tz.guess();

export const DATE_FORMAT = `MMM D`;
export const TIME_FORMAT = `h:mma`;
export const DATE_TIME_FORMAT = `${DATE_FORMAT} ${TIME_FORMAT}`;

export const formatDate = (
  date: Date | string,
  { includeYear }: { includeYear?: boolean } = {}
) => {
  const fixedDate = fixTimezone(date);

  if (includeYear) {
    return dayjs(fixedDate).format(`${DATE_FORMAT}, YYYY`);
  }
  return dayjs(fixedDate).format(DATE_FORMAT);
};
export const formatDateDb = (date: Date) => {
  const fixedDate = fixTimezone(date);
  return dayjs(fixedDate).format(`YYYY-MM-DD`);
};

export const formatDateSlug = (date: Date | string) => {
  const fixedDate = fixTimezone(date);
  return dayjs(fixedDate).format(`MMMD-hmm`).toLowerCase();
};

export const formatDateTime = (date: Date | string) => {
  const fixedDate = fixTimezone(date);

  return dayjs(fixedDate).format(DATE_TIME_FORMAT);
};

export const formatDateTimeWithEmoji = (date: Date) => {
  const fixedDate = fixTimezone(date);
  return dayjs(fixedDate).format(
    `${DATE_FORMAT} ${timeToEmoji(new Date(fixedDate))} ${TIME_FORMAT}`
  );
};

const fixTimezone = (date: Date | string) => {
  if (typeof date === "string" && !date.includes("Z")) {
    return dayjs.utc(date).tz(localTimezone).toDate();
  }
  return date;
};
