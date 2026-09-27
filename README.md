# open-jev demo

Interactive demo for the [`open-jev`](https://www.npmjs.com/package/open-jev) npm package: typed decisions in the browser with Jev-shaped models, running fully on-device via Transformers.js (WebGPU with a WebAssembly fallback).

## What it shows

**Install screen**

- Pick one of the five built-in models (`kev-0.6b`, `open-jev`, `gliner2-decide`, `julia-1`, `kev-4b`) and a weight variant.
- See device, cache status and download size before loading (`OpenJev.info()`), then load with a live progress bar.
- Two short explainers: what Jev / System One models are, and what the `open-jev` package does.

**Demo screen** (after a model is loaded)

- Four demos, each a single `decide()` call with a handful of typed questions:
  email triage, comment moderation and sentiment tagging, lead scoring, support ticket routing.
- Run a demo over five sample states and inspect every answer with its full probability distribution.
- A timing panel with wall-clock total, per-state bars, average, fastest and slowest (the warm-up call is excluded from the average).
- A "Code" button per demo that opens the minimal implementation.

## Run it

```bash
npm install
npm run dev
```

Other scripts: `npm run build`, `npm run preview`, `npm run lint`, `npm run format`.

## Structure

```
src/
├── components/
│   ├── install/     # model picker, dtype picker, load panel, explainer cards
│   ├── demo/        # demo selector, result cards, timing panel, code modal
│   └── TopBar.tsx
├── demos/           # one file per demo: questions, sample states, summary, code snippet
├── lib/jev.ts       # OpenJev singleton loader
├── theme/           # reusable UI (Button, Badge, Card, Modal, Meter, ProgressBar, CodeBlock)
├── utils/           # cn() and formatting helpers
├── constants.ts     # model catalog and links
└── index.css        # Tailwind v4 theme tokens and animations
```

## Notes

- The models are English only and were trained on a handful of domains; questions outside those domains work but are less accurate.
- Timings are measured around each `decide()` call in the main thread. The first call after loading includes shader compilation.
