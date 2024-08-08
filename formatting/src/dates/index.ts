import dayjs from "dayjs";
import { timeToEmoji } from "@formatting/time";

export const DATE_FORMAT = `MMM D`;
export const TIME_FORMAT = `h:mma`;
export const DATE_TIME_FORMAT = `${DATE_FORMAT} ${TIME_FORMAT}`;

export const formatDate = (
  date: Date | string,
  { includeYear }: { includeYear?: boolean } = {}
) => {
  if (includeYear) {
    return dayjs(date).format(`${DATE_FORMAT}, YYYY`);
  }
  return dayjs(date).format(DATE_FORMAT);
};
export const formatDateSlug = (date: Date | string) => {
  return dayjs(date).format(`MMMD-hmm`).toLowerCase();
};

export const formatDateTime = (date: Date | string) => {
  return dayjs(date).format(DATE_TIME_FORMAT);
};

export const formatDateTimeWithEmoji = (date: Date) => {
  return dayjs(date).format(
    `${DATE_FORMAT} ${timeToEmoji(date)} ${TIME_FORMAT}`
  );
};
