import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // One Transformers.js for the app and the linked open-jev, so `env` is shared.
  resolve: { dedupe: ["@huggingface/transformers"] },
  optimizeDeps: {
    exclude: ["@huggingface/transformers"],
  },
  build: {
    target: "esnext",
    chunkSizeWarningLimit: 4000,
  },
});
