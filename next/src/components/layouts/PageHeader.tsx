import { cn } from "@next/lib/utils";

interface PageHeaderProps {
  className?: string;
  children: React.ReactNode;
}

const PageHeader = ({ className, children }: PageHeaderProps) => {
  return (
    <section
      className={cn("container mb-4 flex flex-col overflow-hidden", className)}
    >
      <div className="p-8">{children}</div>
    </section>
  );
};

export default PageHeader;
