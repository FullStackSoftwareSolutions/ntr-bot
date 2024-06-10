"use client";

import { useSession } from "@next/providers/SessionProvier";
import React from "react";

type SignedOutProps = {
  children: React.ReactNode;
};

const SignedOut = ({ children }: SignedOutProps) => {
  const { user } = useSession();
  if (!!user) return null;

  return children;
};

export default SignedOut;
