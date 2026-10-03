import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import type { ModelAlias, OpenJevDtype } from "open-jev";
import { REFERENCE_RUN } from "../../benchmark/results";
import { MODEL_CATALOG, type ModelCatalogEntry } from "../../constants";
import cn from "../../utils/classnames";

interface ModelPickerProps {
  value: ModelAlias;
  onChange: (alias: ModelAlias) => void;
  disabled?: boolean;
  className?: string;
}

/** Three starting points, by what people pick a model for. */
const FEATURED: { alias: ModelAlias; role: string }[] = [
  { alias: "kev-0.6b", role: "Fastest" },
  { alias: "gliner2-decide", role: "Best balance" },
  { alias: "strands-decider-2b", role: "Most accurate" },
];

/** Default variant: the first dtype after "auto". */
function defaultDtype(entry: ModelCatalogEntry): OpenJevDtype | undefined {
  return entry.dtypes.find((d): d is OpenJevDtype => d !== "auto");
}

/** typed-decisions accuracy and median time per state from the reference run. */
function stats(alias: ModelAlias) {
  const row = REFERENCE_RUN.find((r) => r.alias === alias);
  if (!row) return null;
  const correct = row.choice[0] + row.score[0] + row.noul[0];
  const total = row.choice[1] + row.score[1] + row.noul[1];
  return { accuracy: correct / total, ms: row.medianMs };
}

const pct = (x: number) => `${(x * 100).toFixed(1)}%`;
const time = (ms: number) =>
  ms >= 1000 ? `${(ms / 1000).toFixed(1)} s` : `${Math.round(ms)} ms`;

export default function ModelPicker({
  value,
  onChange,
  disabled = false,
  className = "",
}: ModelPickerProps) {
  const featured = FEATURED.map((f) => ({
    ...f,
    entry: MODEL_CATALOG.find((e) => e.alias === f.alias)!,
  })).filter((f) => f.entry);
  const isFeatured = featured.some((f) => f.alias === value);
  const [open, setOpen] = useState(!isFeatured);

  // Group by family; single-model families share one "Other" group at the end.
  const grouped: [string, ModelCatalogEntry[]][] = [];
  for (const entry of MODEL_CATALOG) {
    const group = grouped.find(([name]) => name === entry.family);
    if (group) group[1].push(entry);
    else grouped.push([entry.family, [entry]]);
  }
  const singles = grouped.filter(([, entries]) => entries.length === 1).flatMap(([, e]) => e);
  const families: [string, ModelCatalogEntry[]][] = [
    ...grouped.filter(([, entries]) => entries.length > 1),
    ...(singles.length ? [["Other", singles] as [string, ModelCatalogEntry[]]] : []),
  ];

  return (
    <div role="radiogroup" aria-label="Model" className={cn("grid gap-4", className)}>
      <div className="grid gap-3 sm:grid-cols-3">
        {featured.map(({ alias, role, entry }, index) => {
          const selected = alias === value;
          const s = stats(alias);
          const dtype = defaultDtype(entry);
          return (
            <button
              key={alias}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={disabled}
              onClick={() => onChange(alias)}
              style={{ animationDelay: `${index * 70}ms` }}
              className={cn(
                "animate-fade-up flex flex-col items-start gap-3 rounded-3xl border-2 p-5 text-left transition-all duration-300 ease-out",
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
                <span
                  className={cn("text-xs font-semibold uppercase tracking-wider", {
                    "text-lime": selected,
                    "text-stone": !selected,
                  })}
                >
                  {role}
                </span>
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
                <div className="text-lg font-semibold tracking-tight">{entry.name}</div>
                <div className={cn("text-xs", selected ? "text-white/60" : "text-stone")}>
                  {entry.maker}
                </div>
              </div>
              <dl className="mt-auto grid w-full grid-cols-3 gap-2 text-left">
                {[
                  ["Accuracy", s ? pct(s.accuracy) : "—"],
                  ["Per state", s ? time(s.ms) : "—"],
                  ["Download", dtype ? entry.sizes[dtype] ?? "—" : "—"],
                ].map(([label, v]) => (
                  <div key={label}>
                    <dt className={cn("text-[11px]", selected ? "text-white/50" : "text-stone")}>
                      {label}
                    </dt>
                    <dd className="font-mono text-sm tabular-nums">{v}</dd>
                  </div>
                ))}
              </dl>
            </button>
          );
        })}
      </div>

      <div className="rounded-3xl bg-cream">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold"
        >
          <span>
            All models{" "}
            <span className="font-normal text-stone">({MODEL_CATALOG.length})</span>
            {!isFeatured && (
              <span className="ml-2 font-normal text-stone">
                · {MODEL_CATALOG.find((e) => e.alias === value)?.name} selected
              </span>
            )}
          </span>
          <ChevronDown
            size={16}
            className={cn("transition-transform duration-300", { "rotate-180": open })}
          />
        </button>
        {open && (
          <div className="px-2 pb-3 sm:px-3">
            <div className="hidden grid-cols-[minmax(0,1fr)_5.5rem_5rem_5rem] gap-3 px-3 pb-1 text-[11px] text-stone sm:grid">
              <span>Model</span>
              <span className="text-right">Accuracy</span>
              <span className="text-right">Per state</span>
              <span className="text-right">Download</span>
            </div>
            {families.map(([family, entries]) => (
              <div key={family} className="mt-2">
                <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-stone">
                  {family}
                </div>
                {entries.map((entry) => {
                  const selected = entry.alias === value;
                  const s = stats(entry.alias);
                  const dtype = defaultDtype(entry);
                  return (
                    <button
                      key={entry.alias}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      disabled={disabled}
                      onClick={() => onChange(entry.alias)}
                      className={cn(
                        "grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors sm:grid-cols-[minmax(0,1fr)_5.5rem_5rem_5rem]",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-periwinkle",
                        "disabled:cursor-not-allowed disabled:opacity-60",
                        { "bg-ink text-white": selected, "hover:bg-cream-dark": !selected }
                      )}
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">{entry.name}</span>
                        <span
                          className={cn("block truncate text-xs", selected ? "text-white/60" : "text-stone")}
                        >
                          {entry.maker} · {entry.base.replace(/ \(.*\)$/, "")}
                        </span>
                      </span>
                      <span className="text-right font-mono text-sm tabular-nums">
                        {s ? pct(s.accuracy) : "—"}
                        {entry.home && (
                          <span
                            title="Trained on the benchmark's own workflows; not a zero-shot score"
                            className={cn("ml-1 align-super text-[10px]", selected ? "text-lime" : "text-periwinkle")}
                          >
                            home
                          </span>
                        )}
                      </span>
                      <span className="hidden text-right font-mono text-sm tabular-nums sm:block">
                        {s ? time(s.ms) : "—"}
                      </span>
                      <span className="hidden text-right font-mono text-sm tabular-nums sm:block">
                        {dtype ? entry.sizes[dtype] ?? "—" : "—"}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
            <p className="px-3 pt-3 text-xs text-stone">
              Accuracy: typed-decisions test split (2,000 questions), top answer against the
              annotators' label, at each model's default variant on an M3 Pro.{" "}
              <span className="text-periwinkle">home</span>: trained on the benchmark's own
              workflows.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
