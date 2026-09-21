import cn from "../../utils/classnames";

interface CountBadgeProps {
  value: number | string;
  className?: string;
}

export default function CountBadge({ value, className = "" }: CountBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-ink px-2 text-sm font-bold text-white",
        className
      )}
    >
      {value}
    </span>
  );
}
