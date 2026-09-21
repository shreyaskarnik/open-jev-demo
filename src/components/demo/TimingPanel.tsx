import { Activity, Timer } from "lucide-react";
import type { OpenJevRuntime } from "open-jev";
import { useState } from "react";
import type { DemoDefinition, ItemResult } from "../../demos";
import { Badge, Card } from "../../theme";
import cn from "../../utils/classnames";
import { formatMs } from "../../utils/format";

interface TimingPanelProps {
  demo: DemoDefinition;
  results: ItemResult[];
  running: boolean;
  runtime: OpenJevRuntime;
  className?: string;
}

const CHART_HEIGHT = 140;

export default function TimingPanel({
  demo,
  results,
  running,
  runtime,
  className = "",
}: TimingPanelProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const durations = results.map((result) => result.durationMs);
  const total = durations.reduce((sum, value) => sum + value, 0);
  const steady = results.filter((result) => !result.warmUp);
  const steadyTotal = steady.reduce((sum, r) => sum + r.durationMs, 0);
  const average =
    steady.length > 0
      ? steadyTotal / steady.length
      : total / Math.max(1, results.length);
  const fastest = durations.length > 0 ? Math.min(...durations) : 0;
  const slowest = durations.length > 0 ? Math.max(...durations) : 0;
  const tokens =
    results.length > 0
      ? Math.round(
          results.reduce((sum, r) => sum + r.stateTokens, 0) / results.length
        )
      : 0;
  const questionCount = Object.keys(demo.questions).length;
  const decisionsPerSecond = average > 0 ? (1000 / average) * questionCount : 0;
  const hasResults = results.length > 0;
  const activeIndex = hovered ?? (hasResults ? results.length - 1 : null);
  const active = activeIndex !== null ? results[activeIndex] : null;

  return (
    <Card
      variant="dark"
      padding="lg"
      className={cn("flex flex-col gap-6", className)}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight">Timings</h3>
          <p className="mt-1 text-sm text-white/60">
            {demo.items.length} states · {questionCount} questions each
          </p>
        </div>
        <Badge tone="outline" className="border-white/15 font-mono text-white">
          {runtime.device} · {runtime.dtype}
        </Badge>
      </div>

      <div className="flex items-end gap-3">
        <div
          key={results.length}
          className={cn(
            "animate-pop text-5xl font-semibold tracking-tight tabular-nums",
            {
              "text-white/30": !hasResults,
            }
          )}
        >
          {hasResults ? formatMs(total) : "—"}
        </div>
        <div className="mb-1.5 text-sm text-white/60">
          {running ? (
            <span className="animate-pulse-soft flex items-center gap-1.5 text-lime">
              <Activity size={14} />
              running
            </span>
          ) : hasResults ? (
            "total wall-clock"
          ) : (
            "run the demo to measure"
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex h-8 items-center justify-center">
          {active && (
            <div
              key={activeIndex}
              className="animate-scale-in rounded-xl bg-white px-3 py-1.5 text-xs font-semibold text-ink"
            >
              {demo.items[activeIndex ?? 0]?.label} ·{" "}
              {formatMs(active.durationMs)}
              {active.warmUp && (
                <span className="ml-1 font-normal text-stone">warm-up</span>
              )}
            </div>
          )}
        </div>
        <div
          className="flex items-end gap-2"
          style={{ height: CHART_HEIGHT }}
          role="img"
          aria-label="Decision time per state"
        >
          {demo.items.map((item, index) => {
            const result = results[index];
            const isRunning = running && index === results.length;
            const height = result
              ? Math.max(
                  6,
                  (result.durationMs / Math.max(slowest, 1)) * CHART_HEIGHT
                )
              : isRunning
                ? CHART_HEIGHT * 0.35
                : 6;
            const isActive = index === activeIndex;
            return (
              <div
                key={item.id}
                className="group flex h-full flex-1 items-end"
                onMouseEnter={() => result && setHovered(index)}
                onMouseLeave={() => setHovered(null)}
              >
                <div
                  className={cn(
                    "w-full origin-bottom rounded-t-lg rounded-b-sm transition-all duration-500 ease-out",
                    {
                      "animate-grow-y bg-periwinkle":
                        Boolean(result) && isActive,
                      "animate-grow-y bg-periwinkle-light":
                        Boolean(result) && !isActive,
                      "animate-pulse-soft bg-lime/60": isRunning,
                      "bg-white/10": !result && !isRunning,
                    }
                  )}
                  style={{ height }}
                  title={
                    result
                      ? `${item.label}: ${formatMs(result.durationMs)}`
                      : item.label
                  }
                />
              </div>
            );
          })}
        </div>
        <div className="flex gap-2">
          {demo.items.map((item, index) => (
            <div
              key={item.id}
              className={cn("flex-1 truncate text-center text-xs", {
                "text-white": index === activeIndex,
                "text-white/45": index !== activeIndex,
              })}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Stat
          label="Avg per state"
          value={hasResults ? formatMs(average) : "—"}
          hint={
            steady.length > 0 && steady.length < results.length
              ? "excl. warm-up"
              : undefined
          }
        />
        <Stat
          label="Decisions / s"
          value={hasResults ? decisionsPerSecond.toFixed(1) : "—"}
          hint={`${questionCount} per pass`}
        />
        <Stat label="Fastest" value={hasResults ? formatMs(fastest) : "—"} />
        <Stat label="Slowest" value={hasResults ? formatMs(slowest) : "—"} />
        <Stat
          label="Avg state tokens"
          value={hasResults ? String(tokens) : "—"}
        />
        <Stat
          label="Model"
          value={runtime.model.split("/").pop() ?? runtime.model}
          mono
        />
      </div>

      <p className="flex items-start gap-2 text-xs leading-relaxed text-white/50">
        <Timer size={14} className="mt-0.5 shrink-0" />
        Times are measured around each decide() call in this tab. The first call
        after loading includes shader compilation and is excluded from the
        average.
      </p>
    </Card>
  );
}

interface StatProps {
  label: string;
  value: string;
  hint?: string;
  mono?: boolean;
}

function Stat({ label, value, hint, mono = false }: StatProps) {
  return (
    <div className="rounded-2xl bg-white/5 p-3">
      <div className="text-xs text-white/55">{label}</div>
      <div
        className={cn("mt-1 truncate text-lg font-semibold tabular-nums", {
          "font-mono text-sm": mono,
        })}
        title={value}
      >
        {value}
      </div>
      {hint && <div className="text-xs text-white/40">{hint}</div>}
    </div>
  );
}
