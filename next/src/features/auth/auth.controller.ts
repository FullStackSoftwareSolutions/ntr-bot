import { lucia, validateRequest } from "@next/auth";

export const logoutHandler = async () => {
  const { session } = await validateRequest();
  if (session) {
    await lucia.invalidateSession(session.id);
  }
};
