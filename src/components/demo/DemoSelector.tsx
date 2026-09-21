import { ArrowRight } from "lucide-react";
import { DEMOS } from "../../demos";
import type { DemoId } from "../../demos";
import { Badge } from "../../theme";
import cn from "../../utils/classnames";

interface DemoSelectorProps {
  value: DemoId;
  onChange: (id: DemoId) => void;
  disabled?: boolean;
  className?: string;
}

export default function DemoSelector({
  value,
  onChange,
  disabled = false,
  className = "",
}: DemoSelectorProps) {
  return (
    <div
      role="tablist"
      aria-label="Demos"
      className={cn("grid gap-4 sm:grid-cols-2 xl:grid-cols-4", className)}
    >
      {DEMOS.map((demo, index) => {
        const selected = demo.id === value;
        const Icon = demo.icon;
        return (
          <button
            key={demo.id}
            type="button"
            role="tab"
            aria-selected={selected}
            disabled={disabled}
            onClick={() => onChange(demo.id)}
            style={{ animationDelay: `${index * 70}ms` }}
            className={cn(
              "group animate-fade-up relative flex flex-col gap-4 rounded-3xl p-5 text-left transition-all duration-300 ease-out",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-periwinkle focus-visible:ring-offset-2 focus-visible:ring-offset-cream",
              "disabled:cursor-not-allowed disabled:opacity-60",
              {
                "bg-ink text-white shadow-lift": selected,
                "bg-white text-ink shadow-card hover:-translate-y-1 hover:shadow-lift":
                  !selected,
              }
            )}
          >
            <div className="flex items-center justify-between">
              <Badge tone={demo.tone} size="sm">
                {demo.tag}
              </Badge>
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300",
                  {
                    "bg-lime text-ink": selected,
                    "bg-cream text-ink group-hover:bg-ink group-hover:text-white":
                      !selected,
                  }
                )}
              >
                <Icon size={16} />
              </span>
            </div>
            <div>
              <div className="text-lg font-semibold tracking-tight">
                {demo.title}
              </div>
              <p
                className={cn("mt-1 text-sm leading-snug", {
                  "text-white/70": selected,
                  "text-stone": !selected,
                })}
              >
                {demo.description}
              </p>
            </div>
            <div
              className={cn(
                "mt-auto flex items-center gap-1.5 text-xs font-semibold",
                {
                  "text-lime": selected,
                  "text-stone group-hover:text-ink": !selected,
                }
              )}
            >
              {Object.keys(demo.questions).length} questions ·{" "}
              {demo.items.length} samples
              <ArrowRight
                size={14}
                className={cn("transition-transform duration-300", {
                  "translate-x-0.5": selected,
                  "group-hover:translate-x-0.5": !selected,
                })}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}
