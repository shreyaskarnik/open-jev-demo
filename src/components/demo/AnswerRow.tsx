import type { Answer } from "open-jev";
import { answerConfidence, answerValue } from "../../demos/answers";
import { Meter } from "../../theme";
import cn from "../../utils/classnames";
import { formatPercent } from "../../utils/format";

interface AnswerRowProps {
  label: string;
  answer: Answer;
  className?: string;
}

function distribution(answer: Answer): Array<[string, number]> {
  if (answer.type === "noul") {
    return [
      ["yes", answer.probability],
      ["no", 1 - answer.probability],
    ];
  }
  const entries = Object.entries(answer.probabilities);
  // Score levels keep their scale order; choice options sort by probability.
  if (answer.type === "score") return entries;
  return entries.sort((a, b) => b[1] - a[1]);
}

function metric(answer: Answer): string {
  if (answer.type === "score") {
    const levels = Object.keys(answer.probabilities).length - 1;
    return `score ${answer.score.toFixed(2)} / ${levels}`;
  }
  if (answer.type === "noul")
    return `p(yes) ${formatPercent(answer.probability)}`;
  return `confidence ${formatPercent(answerConfidence(answer))}`;
}

export default function AnswerRow({
  label,
  answer,
  className = "",
}: AnswerRowProps) {
  const value = answerValue(answer);
  const isNoul = answer.type === "noul";
  const tone = isNoul
    ? answer.answer
      ? "mint"
      : "rose"
    : answer.type === "score"
      ? "lavender"
      : "periwinkle";

  return (
    <div className={cn("rounded-2xl bg-cream px-3 py-2.5", className)}>
      <div className="flex items-center gap-3">
        <span className="w-28 shrink-0 truncate text-xs font-medium text-stone">
          {label}
        </span>
        <span
          className={cn(
            "inline-flex h-7 items-center rounded-full px-3 text-sm font-semibold capitalize",
            {
              "bg-periwinkle text-white": tone === "periwinkle",
              "bg-lavender text-white": tone === "lavender",
              "bg-mint text-ink": tone === "mint",
              "bg-rose text-ink": tone === "rose",
            }
          )}
        >
          {value}
        </span>
        <span className="ml-auto font-mono text-xs text-stone tabular-nums">
          {metric(answer)}
        </span>
      </div>
      <div className="mt-2.5 flex flex-col gap-1.5">
        {distribution(answer).map(([option, probability]) => (
          <Meter
            key={option}
            label={option}
            value={probability}
            valueLabel={formatPercent(probability)}
            tone={option === value.toLowerCase() ? tone : "ink"}
          />
        ))}
      </div>
    </div>
  );
}
