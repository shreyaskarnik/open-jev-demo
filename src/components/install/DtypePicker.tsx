import type { DtypeOption } from "../../constants";
import { DTYPE_LABELS } from "../../constants";
import cn from "../../utils/classnames";

interface DtypePickerProps {
  options: readonly DtypeOption[];
  value: DtypeOption;
  sizes: Partial<Record<DtypeOption, string>>;
  onChange: (dtype: DtypeOption) => void;
  disabled?: boolean;
  className?: string;
}

export default function DtypePicker({
  options,
  value,
  sizes,
  onChange,
  disabled = false,
  className = "",
}: DtypePickerProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Weight variant"
      className={cn("flex flex-wrap gap-2", className)}
    >
      {options.map((option) => {
        const selected = option === value;
        const size = sizes[option];
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => onChange(option)}
            className={cn(
              "flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-all duration-200 ease-out active:scale-95",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-periwinkle focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100",
              {
                "border-ink bg-ink text-white": selected,
                "border-ink/10 bg-white text-ink hover:border-ink/30":
                  !selected,
              }
            )}
          >
            {DTYPE_LABELS[option]}
            {size && (
              <span
                className={cn("font-mono text-xs font-normal", {
                  "text-white/60": selected,
                  "text-stone": !selected,
                })}
              >
                {size}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
