import type { ReactNode } from "react";
import cn from "../../utils/classnames";

interface CodeBlockProps {
  code: string;
  language?: "ts" | "bash";
  compact?: boolean;
  className?: string;
}

const TOKEN_PATTERN =
  /(\/\/[^\n]*)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`)|\b(import|from|export|const|let|var|await|async|function|return|type|interface|new|true|false|null|if|else|for|of|as)\b|\b(\d+(?:\.\d+)?)\b/g;

function highlight(code: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let key = 0;

  for (const match of code.matchAll(TOKEN_PATTERN)) {
    const index = match.index ?? 0;
    if (index > last) nodes.push(code.slice(last, index));
    const [text, comment, string, keyword, number] = match;
    nodes.push(
      <span
        key={key++}
        className={cn({
          "text-stone-light italic": Boolean(comment),
          "text-lime": Boolean(string),
          "text-periwinkle-light": Boolean(keyword),
          "text-mint": Boolean(number),
        })}
      >
        {text}
      </span>
    );
    last = index + text.length;
  }
  if (last < code.length) nodes.push(code.slice(last));
  return nodes;
}

export default function CodeBlock({
  code,
  language = "ts",
  compact = false,
  className = "",
}: CodeBlockProps) {
  const content = language === "ts" ? highlight(code) : code;

  return (
    <pre
      className={cn(
        "scrollbar-thin overflow-auto rounded-2xl bg-ink font-mono text-white",
        {
          "p-4 text-xs leading-relaxed": compact,
          "p-6 text-sm leading-relaxed": !compact,
        },
        className
      )}
    >
      <code>{content}</code>
    </pre>
  );
}
