import dayjs from "dayjs";
import { timeToEmoji } from "./time";

export const formatDateTime = (date: Date) => {
  return dayjs(date).format(`MMM D h:mma`);
};

export const formatDateTimeWithEmoji = (date: Date) => {
  return dayjs(date).format(`MMM D ${timeToEmoji(date)} h:mma`);
};
