import type { HTMLAttributes } from "react";
import cn from "../../utils/classnames";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "light" | "dark" | "cream";
  padding?: "none" | "sm" | "md" | "lg";
  interactive?: boolean;
  selected?: boolean;
  className?: string;
}

export default function Card({
  variant = "light",
  padding = "md",
  interactive = false,
  selected = false,
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "relative rounded-3xl transition-all duration-300 ease-out",
        {
          "bg-white text-ink shadow-card": variant === "light",
          "bg-ink text-white shadow-lift": variant === "dark",
          "bg-cream text-ink": variant === "cream",
          "p-0": padding === "none",
          "p-4": padding === "sm",
          "p-6": padding === "md",
          "p-8": padding === "lg",
          "cursor-pointer hover:-translate-y-0.5 hover:shadow-lift":
            interactive,
          "ring-2 ring-ink ring-offset-2 ring-offset-cream": selected,
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
