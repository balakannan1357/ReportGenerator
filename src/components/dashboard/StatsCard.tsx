import { cn } from "@/lib/utils";
import { AnimatedCard } from "@/components/ui-components/AnimatedCard";

interface StatsCardProps {
  readonly title: string;
  readonly value: string | number;
  readonly icon: React.ReactNode;
  readonly trend?: {
    value: number;
    label: string;
  };
  readonly className?: string;
}

export function StatsCard({
  title,
  value,
  icon,
  trend,
  className,
}: StatsCardProps) {
  return (
    <AnimatedCard className={cn("flex flex-col", className)}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className="p-2 rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
      </div>

      {trend && (
        <div className="mt-auto pt-4">
          <p
            className={cn(
              "text-xs flex items-center",
              trend.value > 0 ? "text-green-600" : "text-red-600"
            )}
          >
            {trend.value > 0 ? "↑" : "↓"} {Math.abs(trend.value)}% {trend.label}
          </p>
        </div>
      )}
    </AnimatedCard>
  );
}
