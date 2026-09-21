import {
  AlertTriangle,
  CheckCircle2,
  Download,
  HardDrive,
  Loader2,
  Zap,
} from "lucide-react";
import type { OpenJevInfo } from "open-jev";
import { Badge, ProgressButton } from "../../theme";
import cn from "../../utils/classnames";
import { formatBytes } from "../../utils/format";

export type LoadStatus = "idle" | "loading" | "ready" | "error";

interface LoadPanelProps {
  info: OpenJevInfo | null;
  infoLoading: boolean;
  status: LoadStatus;
  progress: number;
  loadedBytes: number;
  totalBytes: number;
  error: string | null;
  webGpu: boolean;
  onLoad: () => void;
  className?: string;
}

export default function LoadPanel({
  info,
  infoLoading,
  status,
  progress,
  loadedBytes,
  totalBytes,
  error,
  webGpu,
  onLoad,
  className = "",
}: LoadPanelProps) {
  const isLoading = status === "loading";
  const isReady = status === "ready";

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={webGpu ? "lime" : "neutral"}>
          <Zap size={14} />
          {webGpu ? "WebGPU available" : "WebGPU unavailable, using WASM"}
        </Badge>
        {info && (
          <>
            <Badge tone="outline">
              <HardDrive size={14} />
              {info.isCached
                ? "Cached in browser"
                : `Download ${formatBytes(info.downloadSize)}`}
            </Badge>
            <Badge tone="outline">
              <span className="font-mono">{info.device}</span>
              <span className="text-stone">·</span>
              <span className="font-mono">{info.dtype}</span>
            </Badge>
          </>
        )}
        {infoLoading && !info && (
          <Badge tone="outline" className="animate-pulse-soft">
            <Loader2 size={14} className="animate-spin-slow" />
            Checking cache
          </Badge>
        )}
      </div>

      {info && (
        <p className="text-sm text-stone">
          Resolved to <span className="font-mono text-ink">{info.model}</span>.
          Files are fetched once and kept in the browser cache.
        </p>
      )}

      {status === "error" && error && (
        <div className="animate-fade-in flex items-start gap-3 rounded-2xl bg-rose-soft p-4 text-sm text-ink">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <div>
            <div className="font-semibold">Could not load the model</div>
            <div className="mt-0.5 break-words text-stone">{error}</div>
          </div>
        </div>
      )}

      <ProgressButton
        progress={isReady ? 1 : progress}
        active={isLoading}
        done={isReady}
        disabled={isLoading || isReady}
        onClick={onLoad}
        icon={
          isLoading ? (
            <Loader2 size={20} className="animate-spin-slow" />
          ) : isReady ? (
            <CheckCircle2 size={20} />
          ) : (
            <Download size={20} />
          )
        }
        trailing={
          isLoading && totalBytes > 0
            ? `${formatBytes(loadedBytes)} / ${formatBytes(totalBytes)}`
            : undefined
        }
      >
        {isLoading
          ? totalBytes > 0
            ? "Loading model"
            : "Preparing session"
          : isReady
            ? "Loaded, opening demo"
            : info?.isCached
              ? "Load from cache"
              : "Download and load"}
      </ProgressButton>
    </div>
  );
}
