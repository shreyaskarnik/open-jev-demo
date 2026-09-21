import type { ButtonHTMLAttributes, ReactNode } from "react";
import cn from "../../utils/classnames";

export type ButtonVariant = "primary" | "accent" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
}

export default function Button({
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold whitespace-nowrap transition-all duration-200 ease-out select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-periwinkle focus-visible:ring-offset-2 focus-visible:ring-offset-cream",
        "active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100",
        {
          "bg-ink text-white hover:bg-ink-muted shadow-card":
            variant === "primary",
          "bg-lime text-ink hover:bg-lime-dark shadow-card":
            variant === "accent",
          "bg-white text-ink hover:bg-cream border border-ink/5 shadow-card":
            variant === "secondary",
          "bg-transparent text-ink hover:bg-ink/5": variant === "ghost",
          "h-9 px-4 text-sm": size === "sm",
          "h-12 px-6 text-base": size === "md",
          "h-14 px-8 text-lg": size === "lg",
        },
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
      {iconRight && <span className="shrink-0">{iconRight}</span>}
    </button>
  );
}
