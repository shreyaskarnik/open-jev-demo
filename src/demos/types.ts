import type { LucideIcon } from "lucide-react";
import type { Answer, Question } from "open-jev";

export type Tone = "lime" | "periwinkle" | "lavender" | "mint" | "rose";

export type DemoId =
  "email-triage" | "comment-moderation" | "lead-scoring" | "ticket-routing";

export interface DemoItem {
  id: string;
  label: string;
  meta?: string;
  text: string;
}

export interface DemoSummary {
  headline: string;
  tone: Tone;
  detail?: string;
}

export type AnswerMap = Record<string, Answer>;

export interface DemoDefinition {
  id: DemoId;
  title: string;
  tag: string;
  tone: Tone;
  icon: LucideIcon;
  description: string;
  stateLabel: string;
  questions: Record<string, Question>;
  labels: Record<string, string>;
  items: DemoItem[];
  summarize: (answers: AnswerMap) => DemoSummary;
  code: string;
}

export interface ItemResult {
  itemId: string;
  answers: AnswerMap;
  durationMs: number;
  stateTokens: number;
  warmUp: boolean;
}
