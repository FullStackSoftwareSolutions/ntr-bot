import React from "react";
import { CheckIcon } from "lucide-react";
import ButtonLoading, { type ButtonLoadingProps } from "./button-loading";

export type ButtonConfirmProps = ButtonLoadingProps;

const ButtonConfirm = React.forwardRef<HTMLButtonElement, ButtonConfirmProps>(
  ({ children, onClick, ...props }, ref) => {
    const [confirm, setConfirm] = React.useState(false);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      if (!confirm) {
        setConfirm(true);
        return;
      }

      setConfirm(false);
      if (onClick) {
        onClick(e);
      }
    };

    return (
      <ButtonLoading ref={ref} {...props} onClick={handleClick}>
        {children}
        {confirm && <CheckIcon className="ml-2 h-4 w-4 rounded border-1" />}
      </ButtonLoading>
    );
  },
);
ButtonConfirm.displayName = "ButtonConfirm";

export default ButtonConfirm;
