import { ArrowUpRight, Braces, Gauge, Layers } from "lucide-react";
import { JEV_BLOG_URL } from "../../constants";
import { Badge, Card } from "../../theme";
import cn from "../../utils/classnames";

interface JevIntroCardProps {
  className?: string;
}

const POINTS = [
  {
    icon: Braces,
    title: "Typed, never generated",
    text: "You pass the options. The answer is always one of them, so there is nothing to parse and no schema errors.",
  },
  {
    icon: Gauge,
    title: "Calibrated probabilities",
    text: "Every answer comes with a probability that means what it says. Higher confidence really is higher accuracy.",
  },
  {
    icon: Layers,
    title: "One pass, many questions",
    text: "The state is read once and every question is scored in parallel, so extra questions are almost free.",
  },
];

export default function JevIntroCard({ className = "" }: JevIntroCardProps) {
  return (
    <Card
      variant="dark"
      padding="lg"
      className={cn("flex flex-col gap-6", className)}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <Badge tone="lime" size="sm">
            Background
          </Badge>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight">
            What is Jev?
          </h3>
        </div>
        <a
          href={JEV_BLOG_URL}
          target="_blank"
          rel="noreferrer"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          aria-label="Read the TypeSafe AI announcement"
        >
          <ArrowUpRight size={18} />
        </a>
      </div>

      <p className="text-sm leading-relaxed text-white/75">
        Jev is a <span className="text-white">System One model</span> by
        TypeSafe AI. Instead of chatting, it makes fast, calibrated decisions:
        one piece of text (the{" "}
        <span className="font-mono text-lime">state</span>) plus a set of typed
        questions go in, and a probability distribution per question comes out.
        Think of it as a frontier-quality function call for classify, route,
        score and branch, rather than a text generator.
      </p>

      <ul className="flex flex-col gap-4">
        {POINTS.map(({ icon: Icon, title, text }, index) => (
          <li
            key={title}
            style={{ animationDelay: `${150 + index * 80}ms` }}
            className="animate-fade-up flex gap-3"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-lime">
              <Icon size={18} />
            </span>
            <div>
              <div className="font-semibold">{title}</div>
              <div className="mt-0.5 text-sm text-white/65">{text}</div>
            </div>
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-3 gap-2 rounded-2xl bg-white/5 p-4 text-center">
        <div>
          <div className="text-lg font-semibold text-lime">choice</div>
          <div className="text-xs text-white/60">pick one option</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-periwinkle-light">
            score
          </div>
          <div className="text-xs text-white/60">rate on a scale</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-mint">noul</div>
          <div className="text-xs text-white/60">yes or no</div>
        </div>
      </div>
    </Card>
  );
}
