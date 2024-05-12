import { getAllSkates } from "@db/features/skates/skates.db";

export const getAllSkatesHandler = async () => {
  return getAllSkates();
};
