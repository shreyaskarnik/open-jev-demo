import type { ReactNode } from "react";
import cn from "../../utils/classnames";
import CountBadge from "../badge/CountBadge";

interface SectionTitleProps {
  children: ReactNode;
  count?: number | string;
  action?: ReactNode;
  className?: string;
}

export default function SectionTitle({
  children,
  count,
  action,
  className = "",
}: SectionTitleProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <h2 className="flex items-center gap-3 text-2xl font-semibold tracking-tight">
        {children}
        {count !== undefined && <CountBadge value={count} />}
      </h2>
      {action}
    </div>
  );
}
