import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  readonly title: string;
  readonly description?: string;
  readonly className?: string;
  readonly actions?: React.ReactNode;
}

export function SectionHeader({
  title,
  description,
  className,
  actions,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4",
        className
      )}
    >
      <div>
        <h2 className="section-title">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="mt-2 sm:mt-0">{actions}</div>}
    </div>
  );
}
