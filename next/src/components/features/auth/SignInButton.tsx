"use client";

import ButtonLoading from "@next/components/ui/button-loading";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SignInButtonProps = {
  className?: string;
};

const SignInButton = ({}: SignInButtonProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    setLoading(true);
    router.push("/api/auth/login/github");
  };

  return (
    <ButtonLoading size="sm" loading={loading} onClick={handleClick}>
      Login
    </ButtonLoading>
  );
};

export default SignInButton;
