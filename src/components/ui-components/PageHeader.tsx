import { cn } from "@/lib/utils";

interface PageHeaderProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly className?: string;
  readonly actions?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  className,
  actions,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "page-header flex flex-col md:flex-row md:justify-between md:items-center",
        className
      )}
    >
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="mt-4 md:mt-0 flex-shrink-0">{actions}</div>}
    </div>
  );
}
