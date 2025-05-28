import { cn } from "@next/lib/utils";

interface PageHeaderProps {
  className?: string;
  children: React.ReactNode;
}

const PageHeader = ({ className, children }: PageHeaderProps) => {
  return (
    <section className={cn("mb-4 flex flex-col overflow-hidden", className)}>
      <div className="p-4 px-8 md:p-6 md:px-16">{children}</div>
    </section>
  );
};

export default PageHeader;
