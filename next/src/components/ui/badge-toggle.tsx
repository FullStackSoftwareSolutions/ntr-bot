import { CheckIcon } from "lucide-react";
import { Badge, type BadgeProps } from "./badge";
import { cn } from "@next/lib/utils";
import { Button } from "./button";

export type BadgeToggleProps = {
  checked: boolean;
  onClick: () => void;
} & BadgeProps;

function BadgeToggle({
  checked,
  children,
  onClick,
  className,
  ...props
}: BadgeToggleProps) {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className={cn("h-auto rounded-xl p-0", className)}
      type="button"
    >
      <Badge
        variant={checked ? "default" : "outline"}
        {...props}
        className="w-full"
      >
        <div
          className={cn(
            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-input",
            checked &&
              "text-background-foreground border-background bg-background ",
          )}
        >
          {checked && (
            <CheckIcon className="size-5 text-primary" strokeWidth={4} />
          )}
        </div>
        {children}
      </Badge>
    </Button>
  );
}

export { BadgeToggle };
