import { Sparkles } from "lucide-react";
import type { ModelAlias, OpenJev, OpenJevInfo } from "open-jev";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MODEL_CATALOG } from "../../constants";
import type { DtypeOption } from "../../constants";
import { inspectModel, isWebGpuAvailable, loadJev } from "../../lib/jev";
import { modelFromUrl } from "../../lib/urlModel";
import { Card, SectionTitle } from "../../theme";
import cn from "../../utils/classnames";
import DtypePicker from "./DtypePicker";
import JevIntroCard from "./JevIntroCard";
import LoadPanel from "./LoadPanel";
import type { LoadStatus } from "./LoadPanel";
import ModelPicker from "./ModelPicker";
import PackageCard from "./PackageCard";

interface InstallScreenProps {
  onLoaded: (jev: OpenJev) => void;
  className?: string;
}

const READY_DELAY = 700;

interface InfoState {
  key: string;
  info: OpenJevInfo | null;
}

export default function InstallScreen({
  onLoaded,
  className = "",
}: InstallScreenProps) {
  // `?model=julia-1` (or `?julia-1`) preselects a model, e.g. for shared links.
  const [model, setModel] = useState<ModelAlias>(
    () => modelFromUrl() ?? "kev-0.6b"
  );
  const [dtype, setDtype] = useState<DtypeOption>("auto");
  const [infoState, setInfoState] = useState<InfoState | null>(null);
  const [status, setStatus] = useState<LoadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [loadedBytes, setLoadedBytes] = useState(0);
  const [totalBytes, setTotalBytes] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const webGpu = useMemo(() => isWebGpuAvailable(), []);
  const catalogEntry = useMemo(
    () =>
      MODEL_CATALOG.find((entry) => entry.alias === model) ?? MODEL_CATALOG[0],
    [model]
  );

  const infoKey = `${model}:${dtype}`;
  const info = infoState?.key === infoKey ? infoState.info : null;
  const infoLoading = infoState?.key !== infoKey;

  useEffect(() => {
    let cancelled = false;
    inspectModel({ model, dtype, device: "auto" })
      .then((result) => {
        if (!cancelled) setInfoState({ key: infoKey, info: result });
      })
      .catch(() => {
        if (!cancelled) setInfoState({ key: infoKey, info: null });
      });
    return () => {
      cancelled = true;
    };
  }, [model, dtype, infoKey]);

  const handleModelChange = (alias: ModelAlias) => {
    setModel(alias);
    setDtype("auto");
    setStatus("idle");
    setError(null);
  };

  const handleLoad = useCallback(async () => {
    setStatus("loading");
    setError(null);
    setProgress(0);
    setLoadedBytes(0);
    setTotalBytes(0);
    try {
      const jev = await loadJev(
        { model, dtype, device: "auto" },
        ({ progress: value, loaded, total }) => {
          setProgress(value);
          setLoadedBytes(loaded);
          setTotalBytes(total);
        }
      );
      setProgress(1);
      setStatus("ready");
      setTimeout(() => onLoaded(jev), READY_DELAY);
    } catch (caught) {
      setStatus("error");
      setError(caught instanceof Error ? caught.message : String(caught));
    }
  }, [model, dtype, onLoaded]);

  const busy = status === "loading" || status === "ready";

  return (
    <div className={cn("grid gap-6 xl:grid-cols-12", className)}>
      <div className="flex flex-col gap-6 xl:col-span-7">
        <div className="animate-fade-up">
          <SectionTitle>Install</SectionTitle>
          <p className="mt-2 max-w-xl text-stone">
            Pick a model and a weight variant, then load it into this tab. The
            download happens once. After that, every decision runs locally on
            your GPU.
          </p>
        </div>

        <Card padding="lg" className="animate-fade-up flex flex-col gap-6">
          <StepHeading step={1} title="Pick a model" />
          <ModelPicker
            value={model}
            onChange={handleModelChange}
            disabled={busy}
          />
        </Card>

        <Card
          padding="lg"
          className="animate-fade-up flex flex-col gap-5"
          style={{ animationDelay: "80ms" }}
        >
          <StepHeading
            step={2}
            title="Weight variant"
            hint="Auto picks the best variant for your GPU."
          />
          <DtypePicker
            options={catalogEntry.dtypes}
            value={dtype}
            sizes={catalogEntry.sizes}
            onChange={setDtype}
            disabled={busy}
          />
        </Card>

        <Card
          padding="lg"
          className="animate-fade-up flex flex-col gap-5"
          style={{ animationDelay: "160ms" }}
        >
          <StepHeading step={3} title="Load into the browser" />
          <LoadPanel
            info={info}
            infoLoading={infoLoading}
            status={status}
            progress={progress}
            loadedBytes={loadedBytes}
            totalBytes={totalBytes}
            error={error}
            webGpu={webGpu}
            onLoad={handleLoad}
          />
        </Card>
      </div>

      <div className="flex flex-col gap-6 xl:col-span-5">
        <div className="animate-fade-up flex items-center gap-2 text-stone">
          <Sparkles size={18} className="text-periwinkle" />
          <span className="text-sm font-medium">Two things worth knowing</span>
        </div>
        <JevIntroCard className="animate-fade-up" />
        <PackageCard className="animate-fade-up" />
      </div>
    </div>
  );
}

interface StepHeadingProps {
  step: number;
  title: string;
  hint?: string;
}

function StepHeading({ step, title, hint }: StepHeadingProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lime text-sm font-bold text-ink">
        {step}
      </span>
      <div>
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        {hint && <p className="text-sm text-stone">{hint}</p>}
      </div>
    </div>
  );
}
