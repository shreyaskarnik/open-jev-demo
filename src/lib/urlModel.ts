import type { ModelAlias } from "open-jev";
import { MODEL_CATALOG } from "../constants";

const SHORT_NAMES: Record<string, ModelAlias> = {
  julia: "julia-1",
  gliner2: "gliner2-decide",
  gliner: "gliner2-decide",
  decide: "gliner2-decide",
  kev: "kev-0.6b",
};

/**
 * The model a link asks for: `?model=julia-1`, or a bare `?julia-1` / `?kev-4b`
 * / `?gliner2`. Unknown names are ignored.
 */
export function modelFromUrl(
  search = window.location.search
): ModelAlias | null {
  const params = new URLSearchParams(search);
  const names = [params.get("model"), ...params.keys()].filter(
    (name): name is string => Boolean(name)
  );
  for (const name of names) {
    const key = name.toLowerCase();
    const alias =
      MODEL_CATALOG.find((entry) => entry.alias === key)?.alias ??
      SHORT_NAMES[key];
    if (alias) return alias;
  }
  return null;
}

/** `#benchmark` or `?page=benchmark` opens the benchmark page. */
export function pageFromUrl(): "benchmark" | null {
  const params = new URLSearchParams(window.location.search);
  return window.location.hash === "#benchmark" ||
    params.get("page") === "benchmark" ||
    params.has("benchmark")
    ? "benchmark"
    : null;
}
