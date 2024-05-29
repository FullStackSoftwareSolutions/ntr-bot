import React from "react";
import { Button, type ButtonProps } from "@next/components/ui/button";
import { RefreshCwIcon } from "lucide-react";

export type ButtonLoadingProps = {
  loading: boolean;
} & ButtonProps;

const ButtonLoading = React.forwardRef<HTMLButtonElement, ButtonLoadingProps>(
  ({ loading, children, ...props }, ref) => {
    return (
      <Button ref={ref} {...props} disabled={loading}>
        {loading && <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </Button>
    );
  },
);
ButtonLoading.displayName = "ButtonLoading";

export default ButtonLoading;
