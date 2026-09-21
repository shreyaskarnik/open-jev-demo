import type { HTMLAttributes } from "react";
import cn from "../../utils/classnames";

export type BadgeTone =
  | "lime"
  | "periwinkle"
  | "lavender"
  | "mint"
  | "rose"
  | "dark"
  | "neutral"
  | "outline";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  size?: "sm" | "md";
  className?: string;
}

export default function Badge({
  tone = "neutral",
  size = "md",
  className = "",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold leading-none whitespace-nowrap",
        {
          "bg-lime text-ink": tone === "lime",
          "bg-periwinkle text-white": tone === "periwinkle",
          "bg-lavender text-white": tone === "lavender",
          "bg-mint text-ink": tone === "mint",
          "bg-rose text-ink": tone === "rose",
          "bg-ink text-white": tone === "dark",
          "bg-cream text-ink": tone === "neutral",
          "border border-ink/10 bg-transparent text-ink": tone === "outline",
          "h-6 px-2.5 text-xs": size === "sm",
          "h-8 px-3.5 text-sm": size === "md",
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
