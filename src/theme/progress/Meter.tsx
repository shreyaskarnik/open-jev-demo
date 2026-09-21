import cn from "../../utils/classnames";

interface MeterProps {
  value: number;
  label?: string;
  valueLabel?: string;
  tone?: "lime" | "periwinkle" | "mint" | "lavender" | "rose" | "ink";
  animate?: boolean;
  className?: string;
}

export default function Meter({
  value,
  label,
  valueLabel,
  tone = "periwinkle",
  animate = true,
  className = "",
}: MeterProps) {
  const width = Math.max(0, Math.min(1, value)) * 100;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {label && (
        <span className="w-28 shrink-0 truncate text-xs font-medium text-stone">
          {label}
        </span>
      )}
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink/8">
        <div
          className={cn("h-full origin-left rounded-full", {
            "bg-lime": tone === "lime",
            "bg-periwinkle": tone === "periwinkle",
            "bg-mint": tone === "mint",
            "bg-lavender": tone === "lavender",
            "bg-rose": tone === "rose",
            "bg-ink": tone === "ink",
            "animate-grow-x": animate,
          })}
          style={{ width: `${width}%` }}
        />
      </div>
      {valueLabel && (
        <span className="w-10 shrink-0 text-right font-mono text-xs text-ink tabular-nums">
          {valueLabel}
        </span>
      )}
    </div>
  );
}
