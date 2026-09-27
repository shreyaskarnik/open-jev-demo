import type { ModelAlias, OpenJevDtype } from "open-jev";

/** One model's result on typed-decisions: [correct, total] per question type. */
export interface BenchmarkRow {
  alias: ModelAlias;
  dtype: OpenJevDtype;
  choice: [number, number];
  score: [number, number];
  noul: [number, number];
  workflows: Record<string, [number, number]>;
  /** Median wall-clock per state (one decide() call with its 5 questions). */
  medianMs: number;
}

/**
 * Measured 2026-09-27 in Chrome on a MacBook Pro (M3 Pro, WebGPU,
 * shader-f16), each model at its "auto" dtype, one run.
 */
export const REFERENCE_RUN: readonly BenchmarkRow[] = [
  {
    alias: "julia-1",
    dtype: "fp32",
    choice: [426, 600],
    score: [542, 800],
    noul: [483, 600],
    workflows: {
      agent_trace_observability: [348, 500],
      customer_service: [352, 500],
      invoice_processing: [398, 500],
      security_incidents: [353, 500],
    },
    medianMs: 190.9,
  },
  {
    alias: "kev-4b",
    dtype: "q4f16",
    choice: [360, 600],
    score: [423, 800],
    noul: [396, 600],
    workflows: {
      agent_trace_observability: [258, 500],
      customer_service: [346, 500],
      invoice_processing: [267, 500],
      security_incidents: [308, 500],
    },
    medianMs: 1590.9,
  },
  {
    alias: "gliner2-decide",
    dtype: "fp16",
    choice: [249, 600],
    score: [355, 800],
    noul: [364, 600],
    workflows: {
      agent_trace_observability: [289, 500],
      customer_service: [188, 500],
      invoice_processing: [243, 500],
      security_incidents: [248, 500],
    },
    medianMs: 347.8,
  },
  {
    alias: "kev-0.6b",
    dtype: "q4f16",
    choice: [219, 600],
    score: [287, 800],
    noul: [382, 600],
    workflows: {
      agent_trace_observability: [166, 500],
      customer_service: [247, 500],
      invoice_processing: [242, 500],
      security_incidents: [233, 500],
    },
    medianMs: 287.2,
  },
  {
    alias: "open-jev",
    dtype: "fp16",
    choice: [211, 600],
    score: [258, 800],
    noul: [334, 600],
    workflows: {
      agent_trace_observability: [182, 500],
      customer_service: [211, 500],
      invoice_processing: [208, 500],
      security_incidents: [202, 500],
    },
    medianMs: 249.9,
  },
];

export const REFERENCE_DEVICE = "MacBook Pro M3 Pro · Chrome · WebGPU";
