import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Dev only: `?models=local` reads model repos from public/models/<repo id>/
// (unpublished conversions) before the Hub.
if (import.meta.env.DEV && new URLSearchParams(location.search).get("models") === "local") {
  const { env } = await import("@huggingface/transformers");
  env.allowLocalModels = true;
  env.localModelPath = "/models/";
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
