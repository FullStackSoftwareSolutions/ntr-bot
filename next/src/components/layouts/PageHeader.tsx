import { cn } from "@next/lib/utils";

interface PageHeaderProps {
  className?: string;
  children: React.ReactNode;
}

const PageHeader = ({ className, children }: PageHeaderProps) => {
  return (
    <section
      className={cn(
        "m-16 mb-8 flex flex-col overflow-hidden md:container",
        className,
      )}
    >
      {children}
    </section>
  );
};

export default PageHeader;
