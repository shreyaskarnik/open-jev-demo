import type { ButtonHTMLAttributes, ReactNode } from "react";
import cn from "../../utils/classnames";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
  active?: boolean;
  tone?: "dark" | "light";
  className?: string;
}

export default function IconButton({
  icon,
  label,
  active = false,
  tone = "dark",
  className = "",
  ...props
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      title={label}
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-200 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-periwinkle",
        "active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100",
        {
          "bg-white text-ink shadow-lift": active,
          "bg-white/10 text-white hover:bg-white/20":
            tone === "dark" && !active,
          "bg-cream text-ink hover:bg-cream-dark": tone === "light" && !active,
        },
        className
      )}
      {...props}
    >
      {icon}
    </button>
  );
}
