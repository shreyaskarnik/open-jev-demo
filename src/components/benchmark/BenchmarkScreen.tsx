import { Download, Play, RotateCcw } from "lucide-react";
import type { OpenJev } from "open-jev";
import { useCallback, useRef, useState } from "react";
import { REFERENCE_DEVICE, REFERENCE_RUN } from "../../benchmark/results";
import type { BenchmarkRow } from "../../benchmark/results";
import {
  DATASET_URL,
  isCorrect,
  loadCases,
} from "../../benchmark/typedDecisions";
import { MODEL_CATALOG } from "../../constants";
import { Badge, Button, Card, ProgressBar, SectionTitle } from "../../theme";
import cn from "../../utils/classnames";

interface BenchmarkScreenProps {
  jev: OpenJev | null;
  onInstall: () => void;
  className?: string;
}

type Tally = [number, number];
type RunStatus = "idle" | "running" | "done" | "error";

interface LiveRun {
  done: number;
  total: number;
  choice: Tally;
  score: Tally;
  noul: Tally;
  workflows: Record<string, Tally>;
  times: number[];
}

const WORKFLOW_NAMES: Record<string, string> = {
  agent_trace_observability: "Agent traces",
  customer_service: "Customer service",
  invoice_processing: "Invoices",
  security_incidents: "Security incidents",
};

const pct = ([ok, n]: Tally) => (n ? `${((100 * ok) / n).toFixed(1)}%` : "—");
const overall = (
  row: Pick<BenchmarkRow, "choice" | "score" | "noul">
): Tally => [
  row.choice[0] + row.score[0] + row.noul[0],
  row.choice[1] + row.score[1] + row.noul[1],
];
const median = (values: number[]) => {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
};
const nameOf = (alias: string) =>
  MODEL_CATALOG.find((entry) => entry.alias === alias)?.name ?? alias;

export default function BenchmarkScreen({
  jev,
  onInstall,
  className = "",
}: BenchmarkScreenProps) {
  const [status, setStatus] = useState<RunStatus>("idle");
  const [live, setLive] = useState<LiveRun | null>(null);
  const [error, setError] = useState<string | null>(null);
  const runId = useRef(0);

  const loadedAlias = jev
    ? MODEL_CATALOG.find((entry) => entry.repo === jev.runtime.model)?.alias
    : undefined;

  const run = useCallback(async () => {
    if (!jev) return;
    const id = ++runId.current;
    setStatus("running");
    setError(null);
    try {
      const cases = await loadCases(
        `${import.meta.env.BASE_URL}typed-decisions-test.json`
      );
      const state: LiveRun = {
        done: 0,
        total: cases.length,
        choice: [0, 0],
        score: [0, 0],
        noul: [0, 0],
        workflows: {},
        times: [],
      };
      setLive({ ...state });
      // Warm-up: the first call compiles shaders; it is not timed.
      await jev.decide(cases[0].state, cases[0].questions);
      for (const item of cases) {
        if (runId.current !== id) return;
        const started = performance.now();
        const answers = await jev.decide(item.state, item.questions);
        state.times.push(performance.now() - started);
        for (const [key, spec] of Object.entries(item.specs)) {
          const ok = isCorrect(answers[key], spec);
          state[spec.type][1]++;
          const workflow = (state.workflows[item.workflow] ??= [0, 0]);
          workflow[1]++;
          if (ok) {
            state[spec.type][0]++;
            workflow[0]++;
          }
        }
        state.done++;
        if (state.done % 10 === 0 || state.done === state.total) {
          setLive({
            ...state,
            workflows: { ...state.workflows },
            times: [...state.times],
          });
        }
      }
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus("error");
    }
  }, [jev]);

  const running = status === "running";

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      <div className="flex flex-col gap-2">
        <SectionTitle>Benchmark</SectionTitle>
        <p className="max-w-3xl text-sm text-stone">
          Five System One models on the same 2,000 typed questions:{" "}
          <a
            className="font-semibold text-ink underline"
            href={DATASET_URL}
            target="_blank"
            rel="noreferrer"
          >
            typed-decisions
          </a>{" "}
          (test split), 400 states from four workflows, each with 3 kinds of
          question. A question is correct when the model's top answer matches
          the annotators' label. Every state is one{" "}
          <code className="font-mono">decide()</code> call with its 5 questions.
        </p>
      </div>

      <Card padding="lg" className="flex flex-col gap-5 overflow-x-auto">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">Results</h3>
          <Badge tone="outline" size="sm" className="font-mono">
            {REFERENCE_DEVICE}
          </Badge>
        </div>
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="text-xs text-stone uppercase">
            <tr>
              <th className="py-2 pr-4 font-medium">Model</th>
              <th className="py-2 pr-4 font-medium">dtype</th>
              <th className="py-2 pr-4 text-right font-medium">choice</th>
              <th className="py-2 pr-4 text-right font-medium">score</th>
              <th className="py-2 pr-4 text-right font-medium">noul</th>
              <th className="py-2 pr-4 text-right font-medium">overall</th>
              <th className="py-2 text-right font-medium">median / state</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            {REFERENCE_RUN.map((row) => (
              <tr
                key={row.alias}
                className={cn("border-t border-cream", {
                  "bg-lime/30": row.alias === loadedAlias,
                })}
              >
                <td className="py-2 pr-4 font-sans font-semibold">
                  {nameOf(row.alias)}
                </td>
                <td className="py-2 pr-4">{row.dtype}</td>
                <td className="py-2 pr-4 text-right">{pct(row.choice)}</td>
                <td className="py-2 pr-4 text-right">{pct(row.score)}</td>
                <td className="py-2 pr-4 text-right">{pct(row.noul)}</td>
                <td className="py-2 pr-4 text-right font-bold">
                  {pct(overall(row))}
                </td>
                <td className="py-2 text-right">
                  {Math.round(row.medianMs)} ms
                </td>
              </tr>
            ))}
            {live && live.done > 0 && (
              <tr className="border-t-2 border-ink">
                <td className="py-2 pr-4 font-sans font-semibold">
                  Your run · {nameOf(loadedAlias ?? "")}{" "}
                  {status === "running" && `(${live.done}/${live.total})`}
                </td>
                <td className="py-2 pr-4">{jev?.runtime.dtype}</td>
                <td className="py-2 pr-4 text-right">{pct(live.choice)}</td>
                <td className="py-2 pr-4 text-right">{pct(live.score)}</td>
                <td className="py-2 pr-4 text-right">{pct(live.noul)}</td>
                <td className="py-2 pr-4 text-right font-bold">
                  {pct(overall(live))}
                </td>
                <td className="py-2 text-right">
                  {Math.round(median(live.times))} ms
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="text-xs text-stone uppercase">
            <tr>
              <th className="py-2 pr-4 font-medium">Overall by workflow</th>
              {Object.values(WORKFLOW_NAMES).map((name) => (
                <th key={name} className="py-2 pr-4 text-right font-medium">
                  {name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="font-mono">
            {REFERENCE_RUN.map((row) => (
              <tr key={row.alias} className="border-t border-cream">
                <td className="py-2 pr-4 font-sans font-semibold">
                  {nameOf(row.alias)}
                </td>
                {Object.keys(WORKFLOW_NAMES).map((key) => (
                  <td key={key} className="py-2 pr-4 text-right">
                    {pct(row.workflows[key] ?? [0, 0])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card variant="dark" padding="lg" className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Run it on your GPU</h3>
        {jev ? (
          <>
            <p className="text-sm text-white/70">
              Runs all 400 states with the loaded model (
              {nameOf(loadedAlias ?? jev.runtime.model)} · {jev.runtime.device}{" "}
              · {jev.runtime.dtype}). It takes from under a minute to about ten,
              depending on the model and your GPU.
            </p>
            {live && (
              <ProgressBar
                value={live.total ? live.done / live.total : 0}
                tone="lime"
              />
            )}
            <div>
              <Button
                variant={status === "done" ? "accent" : "primary"}
                icon={
                  status === "done" ? (
                    <RotateCcw size={18} />
                  ) : (
                    <Play size={18} />
                  )
                }
                disabled={running}
                onClick={run}
              >
                {running
                  ? `Running ${live?.done ?? 0} / ${live?.total ?? 400}`
                  : status === "done"
                    ? "Run again"
                    : "Run benchmark"}
              </Button>
            </div>
            {error && (
              <p className="text-sm text-rose">Benchmark failed: {error}</p>
            )}
          </>
        ) : (
          <>
            <p className="text-sm text-white/70">
              Load a model first, then come back here to benchmark it on this
              device.
            </p>
            <div>
              <Button
                variant="accent"
                icon={<Download size={18} />}
                onClick={onInstall}
              >
                Choose a model
              </Button>
            </div>
          </>
        )}
      </Card>

      <Card
        variant="cream"
        padding="md"
        className="flex flex-col gap-2 text-sm text-stone"
      >
        <h3 className="text-base font-semibold text-ink">
          Read the numbers with care
        </h3>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            This is Julia 1's own evaluation set, from the workflows it was
            built for. The other models were trained on different domains
            (open-jev: banking, reviews, Wikipedia yes/no; Kev: ten others;
            GLiNER2.5-Decide: 17 operational domains). On the demo's short
            messages the ranking looks different, so measure on your own
            questions.
          </li>
          <li>
            The noul questions come with a description of each outcome. Only
            Julia 1 reads them; without them its noul score is 65.2%. The other
            models answer with fixed no/yes options.
          </li>
          <li>
            States are JSON documents, median about 255 tokens. open-jev reads
            the first 256 state tokens and GLiNER2.5-Decide 384, so long states
            are cut for them.
          </li>
          <li>
            Each model ran at its automatic dtype, once. Julia 1's row
            reproduces its model card's CPU numbers exactly (426/600, 542/800,
            483/600).
          </li>
        </ul>
      </Card>
    </div>
  );
}
