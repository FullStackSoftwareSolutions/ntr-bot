import { cn } from "@next/lib/utils";
import { Loader2Icon } from "lucide-react";

type LoadingIndicatorProps = {
  className?: string;
};

const LoadingIndicator = ({ className }: LoadingIndicatorProps) => {
  return <Loader2Icon className={cn("animate-spin", className)} />;
};

export default LoadingIndicator;
