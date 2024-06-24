"use client";

import ButtonLoading from "@next/components/ui/button-loading";
import { api } from "@next/trpc/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SignOutButtonProps = {
  className?: string;
};

const SignOutButton = ({}: SignOutButtonProps) => {
  const [loading, setLoading] = useState(false);
  const mutation = api.auth.logout.useMutation();
  const router = useRouter();

  const handleClick = async () => {
    setLoading(true);
    await mutation.mutateAsync();
    router.refresh();
  };

  return (
    <ButtonLoading
      onClick={handleClick}
      loading={loading}
      size="sm"
      variant="outline"
    >
      Logout
    </ButtonLoading>
  );
};

export default SignOutButton;
