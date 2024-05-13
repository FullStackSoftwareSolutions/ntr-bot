import dayjs from "dayjs";
import { timeToEmoji } from "@formatting/time";

export const DATE_FORMAT = `MMM D`;
export const DATE_TIME_FORMAT = `${DATE_FORMAT} h:mma`;

export const formatDateTime = (date: Date) => {
  return dayjs(date).format(`MMM D h:mma`);
};

export const formatDateTimeWithEmoji = (date: Date) => {
  return dayjs(date).format(`MMM D ${timeToEmoji(date)} h:mma`);
};
