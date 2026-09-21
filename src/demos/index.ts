import commentModeration from "./commentModeration";
import emailTriage from "./emailTriage";
import leadScoring from "./leadScoring";
import ticketRouting from "./ticketRouting";
import type { DemoDefinition, DemoId } from "./types";

export const DEMOS: readonly DemoDefinition[] = [
  emailTriage,
  commentModeration,
  leadScoring,
  ticketRouting,
];

export function getDemo(id: DemoId): DemoDefinition {
  const demo = DEMOS.find((entry) => entry.id === id);
  if (!demo) throw new Error(`Unknown demo: ${id}`);
  return demo;
}

export type { DemoDefinition, DemoId, DemoItem, ItemResult } from "./types";
