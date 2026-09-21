import type { ButtonHTMLAttributes, ReactNode } from "react";
import cn from "../../utils/classnames";

interface ProgressButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 0..1 */
  progress: number;
  active?: boolean;
  done?: boolean;
  icon?: ReactNode;
  trailing?: ReactNode;
  className?: string;
}

export default function ProgressButton({
  progress,
  active = false,
  done = false,
  icon,
  trailing,
  className = "",
  children,
  disabled,
  ...props
}: ProgressButtonProps) {
  const width = Math.max(0, Math.min(1, progress)) * 100;
  const percent = Math.round(width);

  return (
    <button
      disabled={disabled}
      aria-busy={active}
      className={cn(
        "relative isolate flex h-14 w-full items-center justify-center overflow-hidden rounded-2xl px-8 text-lg font-semibold whitespace-nowrap transition-all duration-300 ease-out select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-periwinkle focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        "disabled:cursor-not-allowed",
        {
          "bg-ink text-white shadow-card hover:bg-ink-muted active:scale-95":
            !active && !done,
          "bg-ink-muted text-white shadow-card": active,
          "bg-lime text-ink shadow-card": done,
        },
        className
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-y-0 left-0 -z-10 rounded-2xl transition-all duration-500 ease-out",
          {
            "bg-periwinkle": active && !done,
            "opacity-0": !active || done,
          }
        )}
        style={{ width: `${width}%` }}
      />
      {active && !done && (
        <span
          aria-hidden="true"
          className="shimmer-bg animate-shimmer absolute inset-0 -z-10"
        />
      )}
      <span className="flex items-center gap-3">
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
        {active && (
          <span className="font-mono text-base tabular-nums opacity-80">
            {percent}%
          </span>
        )}
      </span>
      {trailing && (
        <span className="absolute right-5 hidden font-mono text-xs tabular-nums opacity-70 sm:inline">
          {trailing}
        </span>
      )}
    </button>
  );
}
