import { Code2, Play, RotateCcw } from "lucide-react";
import type { OpenJev } from "open-jev";
import { useCallback, useRef, useState } from "react";
import { DEMOS, getDemo } from "../../demos";
import type { AnswerMap, DemoId, ItemResult } from "../../demos/types";
import { hasWarmedUp, markWarmedUp } from "../../lib/jev";
import { Button, SectionTitle } from "../../theme";
import cn from "../../utils/classnames";
import CodeModal from "./CodeModal";
import DemoSelector from "./DemoSelector";
import ResultCard from "./ResultCard";
import TimingPanel from "./TimingPanel";

interface DemoScreenProps {
  jev: OpenJev;
  className?: string;
}

type RunStatus = "idle" | "running" | "done" | "error";

export default function DemoScreen({ jev, className = "" }: DemoScreenProps) {
  const [demoId, setDemoId] = useState<DemoId>(DEMOS[0].id);
  const [results, setResults] = useState<ItemResult[]>([]);
  const [status, setStatus] = useState<RunStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [codeOpen, setCodeOpen] = useState(false);
  const runId = useRef(0);

  const demo = getDemo(demoId);
  const running = status === "running";

  const handleDemoChange = (id: DemoId) => {
    runId.current += 1;
    setDemoId(id);
    setResults([]);
    setStatus("idle");
    setError(null);
  };

  const run = useCallback(async () => {
    const currentRun = ++runId.current;
    setResults([]);
    setStatus("running");
    setError(null);

    try {
      for (const item of demo.items) {
        const warmUp = !hasWarmedUp();
        const stateTokens = jev.countTokens(item.text);
        const started = performance.now();
        const answers = (await jev.decide(
          item.text,
          demo.questions
        )) as AnswerMap;
        const durationMs = performance.now() - started;
        markWarmedUp();
        if (runId.current !== currentRun) return;
        setResults((previous) => [
          ...previous,
          { itemId: item.id, answers, durationMs, stateTokens, warmUp },
        ]);
      }
      if (runId.current === currentRun) setStatus("done");
    } catch (caught) {
      if (runId.current !== currentRun) return;
      setStatus("error");
      setError(caught instanceof Error ? caught.message : String(caught));
    }
  }, [demo, jev]);

  const resultFor = (itemId: string) =>
    results.find((result) => result.itemId === itemId);
  const runningIndex = running ? results.length : -1;

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      <div className="animate-fade-up">
        <SectionTitle count={DEMOS.length}>Demos</SectionTitle>
        <p className="mt-2 max-w-xl text-stone">
          Each demo is one call to decide() with a handful of typed questions.
          Pick one, run it over the sample states and inspect the distributions.
        </p>
      </div>

      <DemoSelector
        value={demoId}
        onChange={handleDemoChange}
        disabled={running}
      />

      <div key={demoId} className="grid gap-6 xl:grid-cols-12">
        <div className="flex flex-col gap-4 xl:col-span-7">
          <div className="animate-fade-up flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold tracking-tight">
                {demo.title}
              </h3>
              <p className="text-sm text-stone">
                {demo.items.length} sample {demo.stateLabel.toLowerCase()}s
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                icon={<Code2 size={18} />}
                onClick={() => setCodeOpen(true)}
              >
                Code
              </Button>
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
                  ? `Running ${results.length + 1} / ${demo.items.length}`
                  : status === "done"
                    ? "Run again"
                    : "Run demo"}
              </Button>
            </div>
          </div>

          {status === "error" && error && (
            <div className="animate-fade-in rounded-2xl bg-rose-soft p-4 text-sm">
              <span className="font-semibold">Decision failed. </span>
              <span className="text-stone">{error}</span>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {demo.items.map((item, index) => (
              <ResultCard
                key={item.id}
                demo={demo}
                item={item}
                result={resultFor(item.id)}
                running={index === runningIndex}
                index={index}
              />
            ))}
          </div>
        </div>

        <div className="xl:col-span-5">
          <TimingPanel
            demo={demo}
            results={results}
            running={running}
            runtime={jev.runtime}
            className="animate-fade-up xl:sticky xl:top-6"
          />
        </div>
      </div>

      <CodeModal
        demo={demo}
        open={codeOpen}
        onClose={() => setCodeOpen(false)}
      />
    </div>
  );
}
