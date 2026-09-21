import cn from "../../utils/classnames";

interface ProgressBarProps {
  value: number;
  tone?: "lime" | "periwinkle" | "mint" | "lavender" | "rose" | "ink";
  size?: "sm" | "md";
  indeterminate?: boolean;
  className?: string;
}

export default function ProgressBar({
  value,
  tone = "periwinkle",
  size = "md",
  indeterminate = false,
  className = "",
}: ProgressBarProps) {
  const width = Math.max(0, Math.min(1, value)) * 100;

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={indeterminate ? undefined : Math.round(width)}
      className={cn(
        "relative w-full overflow-hidden rounded-full bg-ink/8",
        { "h-1.5": size === "sm", "h-3": size === "md" },
        className
      )}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all duration-500 ease-out",
          {
            "bg-lime": tone === "lime",
            "bg-periwinkle": tone === "periwinkle",
            "bg-mint": tone === "mint",
            "bg-lavender": tone === "lavender",
            "bg-rose": tone === "rose",
            "bg-ink": tone === "ink",
            "shimmer-bg animate-shimmer": indeterminate,
          }
        )}
        style={{ width: indeterminate ? "100%" : `${width}%` }}
      />
    </div>
  );
}
