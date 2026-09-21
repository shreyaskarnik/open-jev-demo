import type { Answer, ChoiceAnswer, NoulAnswer, ScoreAnswer } from "open-jev";
import type { AnswerMap } from "./types";

export function asChoice(answers: AnswerMap, key: string): ChoiceAnswer {
  const answer = answers[key];
  if (answer?.type !== "choice") throw new Error(`${key} is not a choice`);
  return answer;
}

export function asScore(answers: AnswerMap, key: string): ScoreAnswer {
  const answer = answers[key];
  if (answer?.type !== "score") throw new Error(`${key} is not a score`);
  return answer;
}

export function asNoul(answers: AnswerMap, key: string): NoulAnswer {
  const answer = answers[key];
  if (answer?.type !== "noul") throw new Error(`${key} is not a noul`);
  return answer;
}

export function answerValue(answer: Answer): string {
  if (answer.type === "choice") return answer.choice;
  if (answer.type === "score") return answer.level;
  return answer.answer ? "Yes" : "No";
}

export function answerConfidence(answer: Answer): number {
  if (answer.type === "noul") return answer.probability;
  return answer.confidence;
}
