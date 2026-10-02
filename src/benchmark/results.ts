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
    // Measured 2026-09-28 at fp16 (fp32 within 0.2 points).
    alias: "laya-typed-decisions",
    dtype: "fp16",
    choice: [437, 600],
    score: [583, 800],
    noul: [517, 600],
    workflows: {
      agent_trace_observability: [364, 500],
      customer_service: [383, 500],
      invoice_processing: [404, 500],
      security_incidents: [386, 500],
    },
    medianMs: 974.6,
  },
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
    // Measured 2026-10-01 at q8 (q4f16: 58.4%, 1168 of 2000).
    alias: "strands-decider-2b",
    dtype: "q8",
    choice: [337, 600],
    score: [458, 800],
    noul: [392, 600],
    workflows: {
      agent_trace_observability: [224, 500],
      customer_service: [347, 500],
      invoice_processing: [285, 500],
      security_incidents: [331, 500],
    },
    medianMs: 2227.1,
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
    // Re-measured 2026-09-28 at the new 1024-token default (was 512, 48.4%).
    alias: "gliner2-decide",
    dtype: "fp16",
    choice: [290, 600],
    score: [376, 800],
    noul: [366, 600],
    workflows: {
      agent_trace_observability: [289, 500],
      customer_service: [245, 500],
      invoice_processing: [250, 500],
      security_incidents: [248, 500],
    },
    medianMs: 387.5,
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
  {
    // Measured 2026-09-28 at fp16 (fp32 within 0.2 points).
    alias: "laya",
    dtype: "fp16",
    choice: [175, 600],
    score: [261, 800],
    noul: [290, 600],
    workflows: {
      agent_trace_observability: [197, 500],
      customer_service: [191, 500],
      invoice_processing: [183, 500],
      security_incidents: [155, 500],
    },
    medianMs: 955.4,
  },
  {
    // Measured 2026-09-28 at fp16 (fp32 within 0.2 points).
    alias: "laya-multilingual",
    dtype: "fp16",
    choice: [178, 600],
    score: [224, 800],
    noul: [299, 600],
    workflows: {
      agent_trace_observability: [142, 500],
      customer_service: [211, 500],
      invoice_processing: [154, 500],
      security_incidents: [194, 500],
    },
    medianMs: 509.3,
  },
];

export const REFERENCE_DEVICE = "MacBook Pro M3 Pro · Chrome · WebGPU";
