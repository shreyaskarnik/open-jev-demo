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
  },
  {
    alias: "gliner2-decide",
    name: "GLiNER2.5-Decide",
    base: "DeBERTa-v3-large (Fastino)",
    repo: "onnx-community/GLiNER2.5-Decide-ONNX",
    context: 512,
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
  },
];

export const DTYPE_LABELS: Record<DtypeOption, string> = {
  auto: "Auto",
  q4f16: "q4f16",
  q4: "q4",
  fp16: "fp16",
  fp32: "fp32",
};
