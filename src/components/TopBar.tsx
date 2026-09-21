import {
  CheckCircle2,
  CircleDashed,
  Download,
  GitBranch,
  LayoutGrid,
  Package,
} from "lucide-react";
import type { OpenJevRuntime } from "open-jev";
import type { ReactNode } from "react";
import { GITHUB_URL, NPM_URL, PACKAGE_VERSION } from "../constants";
import { Badge } from "../theme";
import cn from "../utils/classnames";

export type Screen = "install" | "demo";

interface TopBarProps {
  screen: Screen;
  demoReady: boolean;
  runtime: OpenJevRuntime | null;
  onNavigate: (screen: Screen) => void;
  className?: string;
}

export default function TopBar({
  screen,
  demoReady,
  runtime,
  onNavigate,
  className = "",
}: TopBarProps) {
  return (
    <header
      className={cn(
        "flex flex-wrap items-center justify-between gap-4",
        className
      )}
    >
      <div className="flex items-center gap-4">
        <div className="relative h-10 w-10 shrink-0" role="img" aria-label="">
          <span className="animate-float absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-lime" />
          <span
            className="animate-float absolute right-0.5 bottom-0.5 h-5 w-5 rounded-full bg-periwinkle"
            style={{ animationDelay: "-2s" }}
          />
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">open-jev</h1>
          <Badge tone="outline" size="sm" className="font-mono">
            v{PACKAGE_VERSION}
          </Badge>
          <span className="hidden text-sm text-stone md:inline">
            typed decisions, in the browser
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div key={runtime ? "ready" : "idle"} className="animate-fade-in">
          {runtime ? (
            <Badge tone="lime">
              <CheckCircle2 size={14} />
              <span className="font-mono">
                {runtime.model.split("/").pop()} · {runtime.device} ·{" "}
                {runtime.dtype}
              </span>
            </Badge>
          ) : (
            <Badge tone="neutral">
              <CircleDashed size={14} />
              No model loaded
            </Badge>
          )}
        </div>

        <nav
          aria-label="Screens"
          className="flex items-center gap-1 rounded-2xl bg-white p-1 shadow-card"
        >
          <NavButton
            icon={<Download size={16} />}
            label="Install"
            active={screen === "install"}
            onClick={() => onNavigate("install")}
          />
          <NavButton
            icon={<LayoutGrid size={16} />}
            label="Demos"
            active={screen === "demo"}
            disabled={!demoReady}
            title={demoReady ? undefined : "Load a model first"}
            onClick={() => onNavigate("demo")}
          />
        </nav>

        <div className="flex items-center gap-1">
          <ExternalLink href={NPM_URL} label="open-jev on npm">
            <Package size={18} />
          </ExternalLink>
          <ExternalLink href={GITHUB_URL} label="open-jev on GitHub">
            <GitBranch size={18} />
          </ExternalLink>
        </div>
      </div>
    </header>
  );
}

interface NavButtonProps {
  icon: ReactNode;
  label: string;
  active: boolean;
  disabled?: boolean;
  title?: string;
  onClick: () => void;
}

function NavButton({
  icon,
  label,
  active,
  disabled = false,
  title,
  onClick,
}: NavButtonProps) {
  return (
    <button
      type="button"
      aria-current={active ? "page" : undefined}
      disabled={disabled}
      title={title}
      onClick={onClick}
      className={cn(
        "flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition-all duration-200 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-periwinkle",
        "active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100",
        {
          "bg-ink text-white shadow-card": active,
          "text-ink hover:bg-cream": !active,
        }
      )}
    >
      {icon}
      {label}
    </button>
  );
}

interface ExternalLinkProps {
  href: string;
  label: string;
  children: ReactNode;
}

function ExternalLink({ href, label, children }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-ink shadow-card transition-all duration-200 hover:bg-ink hover:text-white active:scale-95"
    >
      {children}
    </a>
  );
}
