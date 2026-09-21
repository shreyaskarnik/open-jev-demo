import { Clock, Hash, Loader2 } from "lucide-react";
import type { DemoDefinition, DemoItem, ItemResult } from "../../demos";
import { Badge, Card } from "../../theme";
import cn from "../../utils/classnames";
import { formatMs } from "../../utils/format";
import AnswerRow from "./AnswerRow";

interface ResultCardProps {
  demo: DemoDefinition;
  item: DemoItem;
  result?: ItemResult;
  running: boolean;
  index: number;
  className?: string;
}

export default function ResultCard({
  demo,
  item,
  result,
  running,
  index,
  className = "",
}: ResultCardProps) {
  const summary = result ? demo.summarize(result.answers) : null;

  return (
    <Card
      padding="none"
      style={{ animationDelay: `${index * 60}ms` }}
      className={cn(
        "animate-fade-up overflow-hidden",
        { "ring-2 ring-periwinkle": running },
        className
      )}
    >
      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate font-semibold tracking-tight">
                {item.label}
              </span>
              {item.meta && (
                <span className="truncate text-xs text-stone">{item.meta}</span>
              )}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {running && (
              <Badge tone="periwinkle" size="sm" className="animate-pulse-soft">
                <Loader2 size={12} className="animate-spin-slow" />
                Deciding
              </Badge>
            )}
            {summary && (
              <Badge tone={summary.tone} className="animate-pop capitalize">
                {summary.headline}
              </Badge>
            )}
          </div>
        </div>
        <p className="text-sm leading-relaxed text-stone">{item.text}</p>
      </div>

      {result && (
        <div className="animate-fade-in flex flex-col gap-2 border-t border-ink/5 bg-white p-3">
          {Object.entries(result.answers).map(([key, answer], answerIndex) => (
            <div
              key={key}
              className="animate-fade-up"
              style={{ animationDelay: `${answerIndex * 60}ms` }}
            >
              <AnswerRow label={demo.labels[key] ?? key} answer={answer} />
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-2 pt-2 font-mono text-xs text-stone">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {formatMs(result.durationMs)}
              {result.warmUp && (
                <span className="text-stone-light">incl. warm-up</span>
              )}
            </span>
            <span className="flex items-center gap-1">
              <Hash size={12} />
              {result.stateTokens} state tokens
            </span>
            {summary?.detail && (
              <span className="ml-auto capitalize text-ink">
                {summary.detail}
              </span>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
