import { choice, noul, score } from "open-jev";
import type { Answer, Question } from "open-jev";

/**
 * The test split of LocalLLaMA/typed-decisions (Apache-2.0): 400 states from
 * four workflows, 5 questions each (600 choice, 800 score, 600 noul), with
 * annotator labels. Every model gets the same questions: choice options are
 * the criteria ids with their descriptions, score levels are the rubric in
 * order, noul questions carry their outcome descriptions where the dataset has
 * them (julia-1 reads those; the other models answer with fixed no/yes).
 */
export const DATASET_URL =
  "https://huggingface.co/datasets/LocalLLaMA/typed-decisions";

type QuestionType = "choice" | "score" | "noul";

export interface Spec {
  type: QuestionType;
  gold: string;
  levels: string[] | null;
}

export interface BenchCase {
  state: string;
  workflow: string;
  questions: Record<string, Question>;
  specs: Record<string, Spec>;
}

interface RawRow {
  state: string;
  workflow: string;
  questions: string | Record<string, RawQuestion>;
  gold: string | Record<string, { label: string | number }>;
}

interface RawQuestion {
  type: QuestionType;
  instructions: string;
  criteria?: Record<string, string> | string[] | null;
}

export async function loadCases(url: string): Promise<BenchCase[]> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Benchmark data: HTTP ${response.status}`);
  const rows = (await response.json()) as RawRow[];
  return rows.map((row) => {
    const raw =
      typeof row.questions === "string"
        ? (JSON.parse(row.questions) as Record<string, RawQuestion>)
        : row.questions;
    const gold =
      typeof row.gold === "string"
        ? (JSON.parse(row.gold) as Record<string, { label: string | number }>)
        : row.gold;
    const questions: Record<string, Question> = {};
    const specs: Record<string, Spec> = {};
    for (const [id, q] of Object.entries(raw)) {
      if (q.type === "choice") {
        const criteria = q.criteria as Record<string, string>;
        questions[id] = choice(q.instructions, Object.keys(criteria), criteria);
      } else if (q.type === "score") {
        questions[id] = score(q.instructions, q.criteria as string[]);
      } else {
        const criteria = q.criteria as
          { false: string; true: string } | null | undefined;
        questions[id] = criteria
          ? noul(q.instructions, criteria)
          : noul(q.instructions);
      }
      specs[id] = {
        type: q.type,
        gold: String(gold[id].label),
        levels: q.type === "score" ? (q.criteria as string[]) : null,
      };
    }
    // The state is kept as the dataset stores it (Python json.dumps output).
    return { state: row.state, workflow: row.workflow, questions, specs };
  });
}

/** Correct when the top answer equals the annotators' label (as in Julia's own protocol). */
export function isCorrect(answer: Answer, spec: Spec): boolean {
  if (answer.type === "choice") return answer.choice === spec.gold;
  if (answer.type === "noul") return String(answer.answer) === spec.gold;
  const best = Object.entries(answer.probabilities).sort(
    (a, b) => b[1] - a[1]
  )[0][0];
  return String(spec.levels!.indexOf(best)) === spec.gold;
}
