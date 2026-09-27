import { Target } from "lucide-react";
import { choice, noul, score } from "open-jev";
import { asChoice, asNoul, asScore } from "./answers";
import type { DemoDefinition, Tone } from "./types";

export function computeLeadScore(
  intent: number,
  budget: number,
  decisionMaker: number,
  companyWeight: number
): number {
  return Math.round(
    100 *
      (0.45 * intent +
        0.25 * budget +
        0.2 * decisionMaker +
        0.1 * companyWeight)
  );
}

const COMPANY_WEIGHT: Record<string, number> = {
  individual: 0.1,
  "small business": 0.4,
  "mid-market": 0.7,
  enterprise: 1,
};

function scoreTone(value: number): Tone {
  if (value >= 70) return "lime";
  if (value >= 40) return "periwinkle";
  return "rose";
}

const leadScoring: DemoDefinition = {
  id: "lead-scoring",
  title: "Lead scoring",
  tag: "Sales",
  tone: "lavender",
  icon: Target,
  description:
    "Turn inbound messages into a 0 to 100 lead score from intent, budget, authority and company size.",
  stateLabel: "Inbound message",
  questions: {
    intent: score("How close is this person to buying?", [
      "just browsing",
      "curious",
      "evaluating options",
      "ready to buy",
    ]),
    company: choice("What kind of organisation is the sender from?", [
      "individual",
      "small business",
      "mid-market",
      "enterprise",
    ]),
    budget: noul("The sender mentions a budget or a willingness to pay."),
    decisionMaker: noul("The sender can make the purchasing decision."),
  },
  labels: {
    intent: "Buying intent",
    company: "Company size",
    budget: "Has budget",
    decisionMaker: "Decision maker",
  },
  items: [
    {
      id: "l1",
      label: "Priya S.",
      meta: "VP Operations, contact form",
      text: "We are a logistics company with around 1,200 employees and I lead the operations group. We have budget approved for a rollout in Q1 and are comparing three vendors. Can we schedule a technical call this week? I make the final call on this purchase.",
    },
    {
      id: "l2",
      label: "jordan.k",
      meta: "Free plan, in-app chat",
      text: "hey just poking around, is there a student discount? I'm working on a side project for a class and might use this if it's cheap or free.",
    },
    {
      id: "l3",
      label: "Luis M.",
      meta: "Founder, contact form",
      text: "I run a small design studio (six people). We've outgrown spreadsheets and your tool looks like a good fit. Not in a rush, but if the team plan is under $200 a month I'd probably sign up next month after our current projects wrap.",
    },
    {
      id: "l4",
      label: "Aiko T.",
      meta: "Engineer, contact form",
      text: "I'm an engineer at a large bank and I tried your API in a hackathon last week. I like it a lot, but procurement here is a long process and I'd need to convince my director first. Do you have security documentation I could forward?",
    },
    {
      id: "l5",
      label: "Nate B.",
      meta: "Newsletter reply",
      text: "Interesting article on decision models. Curious how this compares to fine-tuning a small classifier ourselves. Not looking to buy anything, just interested in the approach.",
    },
  ],
  summarize: (answers) => {
    const intent = asScore(answers, "intent");
    const company = asChoice(answers, "company");
    const budget = asNoul(answers, "budget");
    const decisionMaker = asNoul(answers, "decisionMaker");
    const total = computeLeadScore(
      intent.normalized,
      budget.probability,
      decisionMaker.probability,
      COMPANY_WEIGHT[company.choice] ?? 0
    );
    return {
      headline: `${total} / 100`,
      tone: scoreTone(total),
      detail: intent.level,
    };
  },
  code: `import { OpenJev, choice, noul, score } from "open-jev";

const jev = await OpenJev.load({ model: "kev-0.6b" });

const lead = await jev.decide(message, {
  intent: score("How close is this person to buying?", [
    "just browsing",
    "curious",
    "evaluating options",
    "ready to buy",
  ]),
  company: choice("What kind of organisation is the sender from?", [
    "individual",
    "small business",
    "mid-market",
    "enterprise",
  ]),
  budget: noul("The sender mentions a budget or a willingness to pay."),
  decisionMaker: noul("The sender can make the purchasing decision."),
});

// Probabilities are calibrated, so they can be combined into a score.
const companyWeight = {
  individual: 0.1,
  "small business": 0.4,
  "mid-market": 0.7,
  enterprise: 1,
}[lead.company.choice];

const leadScore = Math.round(
  100 *
    (0.45 * lead.intent.normalized +
      0.25 * lead.budget.probability +
      0.2 * lead.decisionMaker.probability +
      0.1 * companyWeight)
);`,
};

export default leadScoring;
