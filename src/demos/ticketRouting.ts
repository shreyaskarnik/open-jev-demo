import { TicketCheck } from "lucide-react";
import { choice, noul, score } from "open-jev";
import { asChoice, asNoul, asScore } from "./answers";
import type { DemoDefinition, Tone } from "./types";

const URGENCY_TONES: Record<string, Tone> = {
  low: "mint",
  medium: "periwinkle",
  high: "lavender",
  critical: "rose",
};

const ticketRouting: DemoDefinition = {
  id: "ticket-routing",
  title: "Support ticket routing",
  tag: "Support",
  tone: "mint",
  icon: TicketCheck,
  description:
    "Send each ticket to the right team with an urgency level and an early warning for churn risk.",
  stateLabel: "Ticket",
  questions: {
    team: choice(
      "Which team should handle this ticket?",
      [
        "billing",
        "technical support",
        "account & security",
        "shipping",
        "sales",
      ],
      {
        billing: "charges, invoices, refunds and payment problems",
        "technical support": "bugs, errors, integrations and outages",
        "account & security": "logins, passwords, 2FA and suspicious activity",
        shipping: "deliveries, tracking, damaged or missing parcels",
        sales: "plans, upgrades, quotes and pre-sales questions",
      }
    ),
    urgency: score("How urgent is this ticket?", [
      "low",
      "medium",
      "high",
      "critical",
    ]),
    churnRisk: noul(
      "The customer threatens to cancel or switch to a competitor.",
      {
        false: "The customer wants help and shows no sign of leaving.",
        true: "The customer says they may cancel or move to a competitor.",
      }
    ),
    resolved: noul("The customer says the problem is already solved.", {
      false: "The customer still has the problem.",
      true: "The customer says the problem is fixed and nothing is left to do.",
    }),
  },
  labels: {
    team: "Team",
    urgency: "Urgency",
    churnRisk: "Churn risk",
    resolved: "Already solved",
  },
  items: [
    {
      id: "t1",
      label: "#4821",
      meta: "Pro plan · 2 min ago",
      text: "I was charged twice for the same order and nobody answers my emails. This is the third time this year. If this is not refunded by tomorrow I am cancelling and moving to your competitor.",
    },
    {
      id: "t2",
      label: "#4822",
      meta: "Free plan · 9 min ago",
      text: "Someone logged into my account from a country I have never been to and changed the recovery email. I cannot get back in. Please help, I have customer data in there.",
    },
    {
      id: "t3",
      label: "#4823",
      meta: "Business plan · 21 min ago",
      text: "The webhook for order.created started returning 502 errors around 09:40 UTC. Our retries are piling up but nothing is lost yet. Is there a known incident?",
    },
    {
      id: "t4",
      label: "#4824",
      meta: "Starter plan · 1 h ago",
      text: "My parcel shows as delivered since Monday but it never arrived. The neighbours don't have it either. Order number 88213. Could you check with the carrier?",
    },
    {
      id: "t5",
      label: "#4825",
      meta: "Starter plan · 3 h ago",
      text: "Never mind my earlier message, the invoice PDF opened fine after I updated my browser. Sorry for the noise. While I have you: does the Business plan include SSO?",
    },
  ],
  summarize: (answers) => {
    const team = asChoice(answers, "team");
    const urgency = asScore(answers, "urgency");
    const churn = asNoul(answers, "churnRisk");
    const resolved = asNoul(answers, "resolved");
    return {
      headline: team.choice,
      tone: URGENCY_TONES[urgency.level] ?? "periwinkle",
      detail: resolved.answer
        ? "Already solved"
        : churn.answer
          ? `${urgency.level} · churn risk`
          : urgency.level,
    };
  },
  code: `import { OpenJev, choice, noul, score } from "open-jev";

const jev = await OpenJev.load({ model: "kev-0.6b" });

const ticket = await jev.decide(message, {
  team: choice(
    "Which team should handle this ticket?",
    ["billing", "technical support", "account & security", "shipping", "sales"],
    {
      billing: "charges, invoices, refunds and payment problems",
      "technical support": "bugs, errors, integrations and outages",
      "account & security": "logins, passwords, 2FA and suspicious activity",
      shipping: "deliveries, tracking, damaged or missing parcels",
      sales: "plans, upgrades, quotes and pre-sales questions",
    }
  ),
  urgency: score("How urgent is this ticket?", [
    "low",
    "medium",
    "high",
    "critical",
  ]),
  churnRisk: noul("The customer threatens to cancel or switch to a competitor.", { false: "The customer wants help and shows no sign of leaving.", true: "The customer says they may cancel or move to a competitor." }),
  resolved: noul("The customer says the problem is already solved.", { false: "The customer still has the problem.", true: "The customer says the problem is fixed and nothing is left to do." }),
});

if (ticket.resolved.answer) closeTicket();
else assign(ticket.team.choice, {
  priority: ticket.urgency.level,
  escalate: ticket.churnRisk.probability > 0.7,
});`,
};

export default ticketRouting;
