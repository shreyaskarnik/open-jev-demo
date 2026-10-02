import { Check, Cpu } from "lucide-react";
import type { ModelAlias, OpenJevDtype } from "open-jev";
import { MODEL_CATALOG } from "../../constants";
import { Badge } from "../../theme";
import cn from "../../utils/classnames";

interface ModelPickerProps {
  value: ModelAlias;
  onChange: (alias: ModelAlias) => void;
  disabled?: boolean;
  className?: string;
}

export default function ModelPicker({
  value,
  onChange,
  disabled = false,
  className = "",
}: ModelPickerProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Model"
      className={cn("grid gap-3 sm:grid-cols-3", className)}
    >
      {MODEL_CATALOG.map((entry, index) => {
        const selected = entry.alias === value;
        return (
          <button
            key={entry.alias}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => onChange(entry.alias)}
            style={{ animationDelay: `${index * 70}ms` }}
            className={cn(
              "group animate-fade-up relative flex flex-col items-start gap-3 rounded-3xl border-2 p-5 text-left transition-all duration-300 ease-out",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-periwinkle focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-60",
              {
                "border-ink bg-ink text-white shadow-lift": selected,
                "border-transparent bg-cream text-ink hover:-translate-y-0.5 hover:bg-cream-dark":
                  !selected,
              }
            )}
          >
            <div className="flex w-full items-center justify-between">
              <Badge tone={entry.tone} size="sm">
                {entry.tag}
              </Badge>
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full transition-all duration-300",
                  {
                    "animate-pop bg-lime text-ink": selected,
                    "bg-ink/10 text-transparent": !selected,
                  }
                )}
              >
                <Check size={14} strokeWidth={3} />
              </span>
            </div>
            <div>
              <div className="text-lg font-semibold tracking-tight">
                {entry.name}
              </div>
              <div
                className={cn("mt-0.5 flex items-center gap-1.5 text-xs", {
                  "text-white/60": selected,
                  "text-stone": !selected,
                })}
              >
                <Cpu size={12} />
                {entry.base}
              </div>
            </div>
            <p
              className={cn("text-sm leading-snug", {
                "text-white/75": selected,
                "text-stone": !selected,
              })}
            >
              {entry.note}
            </p>
            <div
              className={cn("mt-auto flex flex-wrap gap-1.5 text-xs", {
                "text-white/60": selected,
                "text-stone": !selected,
              })}
            >
              {(() => {
                // The model's default variant: the first dtype after "auto".
                const dtype = entry.dtypes.find(
                  (d): d is OpenJevDtype => d !== "auto"
                );
                return dtype ? (
                  <span className="font-mono">
                    {entry.sizes[dtype]} {dtype}
                  </span>
                ) : null;
              })()}
              <span>·</span>
              <span className="font-mono">
                {entry.context.toLocaleString()} ctx
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
