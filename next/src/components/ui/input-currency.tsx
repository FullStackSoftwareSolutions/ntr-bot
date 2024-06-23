import * as React from "react";

import { cn } from "@next/lib/utils";

export type InputCurrencyProps = React.InputHTMLAttributes<HTMLInputElement>;

const InputCurrency = React.forwardRef<HTMLInputElement, InputCurrencyProps>(
  ({ className, onChange, value, ...props }, ref) => {
    return (
      <div className="flex items-center">
        <p className="absolute ms-3 opacity-50">$</p>
        <input
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 ps-8 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);
InputCurrency.displayName = "InputCurrency";

export { InputCurrency };
