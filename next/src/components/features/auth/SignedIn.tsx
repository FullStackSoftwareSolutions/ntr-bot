"use client";

import { useSession } from "@next/providers/SessionProvier";

type SignedInProps = {
  children: React.ReactNode;
};

const SignedIn = ({ children }: SignedInProps) => {
  const { user } = useSession();
  if (!user) return null;

  return children;
};

export default SignedIn;
