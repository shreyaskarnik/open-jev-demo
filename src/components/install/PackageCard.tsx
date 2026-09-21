import { ArrowUpRight, Check, Copy, Package } from "lucide-react";
import { useState } from "react";
import {
  GITHUB_URL,
  NPM_URL,
  PACKAGE_VERSION,
  TRANSFORMERS_JS_URL,
} from "../../constants";
import { Badge, Card, CodeBlock } from "../../theme";
import cn from "../../utils/classnames";

interface PackageCardProps {
  className?: string;
}

const INSTALL_COMMAND = "npm install open-jev @huggingface/transformers";

const QUICK_START = `import { OpenJev, choice, noul, score } from "open-jev";

const jev = await OpenJev.load({ model: "kev-0.6b" });

const [area, mood, refund] = await jev.decide(text, [
  choice("Which area?", ["billing", "shipping", "other"]),
  score("How positive?", ["negative", "neutral", "positive"]),
  noul("The customer asks for a refund."),
]);

area.choice; // "billing" | "shipping" | "other"
mood.level; // "negative" | "neutral" | "positive"
refund.answer; // boolean, with refund.probability`;

export default function PackageCard({ className = "" }: PackageCardProps) {
  const [copied, setCopied] = useState(false);

  const copyInstall = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMAND);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Card padding="lg" className={cn("flex flex-col gap-5", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <Badge tone="periwinkle" size="sm">
            <Package size={12} />
            npm
          </Badge>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight">
            The open-jev package
          </h3>
        </div>
        <Badge tone="outline" className="font-mono">
          v{PACKAGE_VERSION}
        </Badge>
      </div>

      <p className="text-sm leading-relaxed text-stone">
        <span className="font-mono text-ink">open-jev</span> is an open
        reproduction of the Jev shape that runs fully in the browser via{" "}
        <a
          href={TRANSFORMERS_JS_URL}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-ink underline decoration-periwinkle decoration-2 underline-offset-2 transition-colors hover:text-periwinkle"
        >
          Transformers.js
        </a>
        . It ships three ONNX models, uses WebGPU when available and falls back
        to WebAssembly. Everything stays on the device, and the answers are
        fully typed from the options you pass in.
      </p>

      <div className="flex items-center gap-2 rounded-2xl bg-cream p-2 pl-4">
        <code className="min-w-0 flex-1 truncate font-mono text-sm text-ink">
          <span className="text-stone">$ </span>
          {INSTALL_COMMAND}
        </code>
        <button
          type="button"
          onClick={copyInstall}
          aria-label="Copy install command"
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200 active:scale-95",
            {
              "bg-lime text-ink": copied,
              "bg-white text-ink hover:bg-ink hover:text-white": !copied,
            }
          )}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>

      <CodeBlock code={QUICK_START} compact />

      <div className="flex flex-wrap gap-2">
        <a
          href={NPM_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-9 items-center gap-1.5 rounded-full bg-cream px-4 text-sm font-semibold text-ink transition-colors hover:bg-cream-dark"
        >
          npmjs.com
          <ArrowUpRight size={14} />
        </a>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-9 items-center gap-1.5 rounded-full bg-cream px-4 text-sm font-semibold text-ink transition-colors hover:bg-cream-dark"
        >
          GitHub
          <ArrowUpRight size={14} />
        </a>
      </div>
    </Card>
  );
}
