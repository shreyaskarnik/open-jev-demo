import type { ModelAlias, OpenJevDtype } from "open-jev";

export const PACKAGE_NAME = "open-jev";
export const PACKAGE_VERSION = "0.1.2";
export const NPM_URL = "https://www.npmjs.com/package/open-jev";
export const GITHUB_URL = "https://github.com/nico-martin/open-jev";
export const TRANSFORMERS_JS_URL =
  "https://huggingface.co/docs/transformers.js/index";
export const JEV_BLOG_URL =
  "https://typesafe.ai/blog/introducing-system-one-models-and-jev";

export type DtypeOption = OpenJevDtype | "auto";

export interface ModelCatalogEntry {
  alias: ModelAlias;
  name: string;
  base: string;
  repo: string;
  context: number;
  dtypes: readonly DtypeOption[];
  sizes: Partial<Record<OpenJevDtype, string>>;
  note: string;
  tag: string;
  tone: "lime" | "periwinkle" | "lavender";
  /** Who made it, and the family it is grouped under in the model table. */
  maker: string;
  family: string;
  /** Trained on typed-decisions' own workflows: its benchmark score is not zero-shot. */
  home?: boolean;
}

export const MODEL_CATALOG: readonly ModelCatalogEntry[] = [
  {
    alias: "kev-0.6b",
    name: "Kev 0.6B",
    base: "Qwen3-0.6B-Base",
    repo: "onnx-community/kev-0.6b-ONNX",
    context: 8192,
    dtypes: ["auto", "q4f16", "q4"],
    sizes: { q4f16: "0.34 GB", q4: "0.38 GB" },
    note: "Small and fast. The default and the best place to start.",
    tag: "Default",
    tone: "lime",
    maker: "Kev",
    family: "Kev",
  },
  {
    alias: "open-jev",
    name: "open-jev",
    base: "DeBERTa-v3-large",
    repo: "onnx-community/open-jev-deberta-v3-large-ONNX",
    context: 512,
    dtypes: ["auto", "fp16", "q4f16", "q4", "fp32"],
    sizes: {
      q4f16: "0.35 GB",
      q4: "0.48 GB",
      fp16: "0.88 GB",
      fp32: "1.75 GB",
    },
    note: "Encoder model with a 512-token context. Calibrated temperature.",
    tag: "Encoder",
    tone: "periwinkle",
    maker: "open-jev",
    family: "open-jev",
  },
  {
    alias: "gliner2-decide",
    name: "GLiNER2.5-Decide",
    base: "DeBERTa-v3-large (Fastino)",
    repo: "onnx-community/GLiNER2.5-Decide-ONNX",
    context: 1024,
    dtypes: ["auto", "fp16", "q4f16", "q4", "fp32"],
    sizes: {
      q4f16: "0.52 GB",
      q4: "0.89 GB",
      fp16: "0.87 GB",
      fp32: "1.74 GB",
    },
    note: "Fastino's decision model, trained on 17 operational domains. Descriptions go into the prompt.",
    tag: "Trained",
    tone: "periwinkle",
    maker: "Fastino",
    family: "GLiNER2",
  },
  {
    alias: "julia-1",
    name: "Julia 1",
    base: "mmBERT-small (Supersonic Labs)",
    repo: "SupersonicLabs/Julia-1-ONNX",
    context: 1024,
    dtypes: ["auto", "fp32"],
    sizes: { fp32: "0.58 GB" },
    note: "Supersonic Labs' multilingual decision model. Scores each question on its own, 2 to 20 options.",
    tag: "Multilingual",
    tone: "lavender",
    maker: "Supersonic Labs",
    family: "Julia",
    home: true,
  },
  {
    alias: "laya",
    name: "Laya",
    base: "ModernBERT-large (Convai)",
    repo: "onnx-community/laya-ONNX",
    context: 512,
    dtypes: ["auto", "fp16", "fp32"],
    sizes: { fp16: "0.85 GB", fp32: "1.69 GB" },
    note: "Convai's English decision model with calibrated temperatures. Scores each question on its own.",
    tag: "Calibrated",
    tone: "periwinkle",
    maker: "Convai",
    family: "Laya",
  },
  {
    alias: "laya-typed-decisions",
    name: "Laya typed-decisions",
    base: "ModernBERT-large (Convai)",
    repo: "onnx-community/laya-typed-decisions-ONNX",
    context: 1024,
    dtypes: ["auto", "fp16", "fp32"],
    sizes: { fp16: "0.85 GB", fp32: "1.69 GB" },
    note: "Laya fine-tuned on the four typed-decisions workflows, the benchmark's own training data.",
    tag: "Fine-tuned",
    tone: "periwinkle",
    maker: "Convai",
    family: "Laya",
    home: true,
  },
  {
    alias: "laya-multilingual",
    name: "Laya multilingual",
    base: "mmBERT-base (Convai)",
    repo: "onnx-community/laya-multilingual-ONNX",
    context: 1024,
    dtypes: ["auto", "fp16", "fp32"],
    sizes: { fp16: "0.65 GB", fp32: "1.29 GB" },
    note: "Laya for 100+ languages. Reads up to 8,192 tokens; ships with 1,024.",
    tag: "Multilingual",
    tone: "lavender",
    maker: "Convai",
    family: "Laya",
  },
  {
    alias: "strands-decider-2b",
    name: "Strands Decider 2B",
    base: "Qwen3.5-2B-Base (Strands Labs)",
    repo: "onnx-community/strands-decider-2B-hobson-v19-ONNX",
    context: 4096,
    dtypes: ["auto", "q8", "q4f16"],
    sizes: { q8: "1.80 GB", q4f16: "1.09 GB" },
    note: "Strands Labs' decider (v19): a Qwen3.5 torso with a pointer head and calibrated temperatures. Scores each question on its own.",
    tag: "Pointer",
    tone: "lime",
    maker: "Strands Labs",
    family: "Strands Decider",
  },
  {
    alias: "decision2-kai-0.6b",
    name: "Decision 2.0 Kai",
    base: "Qwen3-0.6B-Base (vLLM Semantic Router)",
    repo: "onnx-community/Decision-2.0-Kai-0.6B-ONNX",
    context: 8192,
    dtypes: ["auto", "q8"],
    sizes: { q8: "0.61 GB" },
    note: "vLLM Semantic Router's smallest Decision 2.0 model. Candidate head on a Qwen3 torso; one prompt per question.",
    tag: "Small",
    tone: "lime",
    maker: "vLLM Semantic Router",
    family: "Decision 2.0",
  },
  {
    alias: "decision2-eos-0.8b",
    name: "Decision 2.0 Eos",
    base: "Qwen3.5-0.8B (vLLM Semantic Router)",
    repo: "onnx-community/Decision-2.0-Eos-0.8B-ONNX",
    context: 16384,
    dtypes: ["auto", "q8", "q4f16"],
    sizes: { q8: "0.70 GB", q4f16: "0.44 GB" },
    note: "Decision 2.0 on Qwen3.5-0.8B. One prompt per question.",
    tag: "Decision 2.0",
    tone: "periwinkle",
    maker: "vLLM Semantic Router",
    family: "Decision 2.0",
  },
  {
    alias: "decision2-sol-2b",
    name: "Decision 2.0 Sol",
    base: "Qwen3.5-2B (vLLM Semantic Router)",
    repo: "onnx-community/Decision-2.0-Sol-2B-ONNX",
    context: 16384,
    dtypes: ["auto", "q8", "q4f16"],
    sizes: { q8: "1.81 GB", q4f16: "1.10 GB" },
    note: "Decision 2.0 on Qwen3.5-2B. One prompt per question.",
    tag: "Decision 2.0",
    tone: "lavender",
    maker: "vLLM Semantic Router",
    family: "Decision 2.0",
  },
  {
    alias: "kev-4b",
    name: "Kev 4B",
    base: "Qwen3-4B-Base",
    repo: "onnx-community/kev-4b-ONNX",
    context: 8192,
    dtypes: ["auto", "q4f16", "q4"],
    sizes: { q4f16: "2.3 GB", q4: "2.5 GB" },
    note: "Most accurate. Needs a capable GPU and a large download.",
    tag: "Accurate",
    tone: "lavender",
    maker: "Kev",
    family: "Kev",
  },
];

export const DTYPE_LABELS: Record<DtypeOption, string> = {
  auto: "Auto",
  q8: "q8",
  q4f16: "q4f16",
  q4: "q4",
  fp16: "fp16",
  fp32: "fp32",
};
