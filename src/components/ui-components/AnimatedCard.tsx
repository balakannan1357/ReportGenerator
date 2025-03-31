import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface AnimatedCardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "glass";
}

const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ className, children, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-xl p-6 shadow-md transition-all duration-300 ease-in-out animate-slide-in hover:shadow-lg",
          variant === "glass" && "glass-card",
          variant === "default" && "bg-card text-card-foreground",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AnimatedCard.displayName = "AnimatedCard";

export { AnimatedCard };
