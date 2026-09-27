import { Mail } from "lucide-react";
import { choice, noul, score } from "open-jev";
import { asChoice, asNoul, asScore } from "./answers";
import type { DemoDefinition, Tone } from "./types";

const PRIORITY_TONES: Record<string, Tone> = {
  low: "mint",
  medium: "periwinkle",
  high: "lavender",
  urgent: "rose",
};

const emailTriage: DemoDefinition = {
  id: "email-triage",
  title: "Email triage",
  tag: "Inbox",
  tone: "lime",
  icon: Mail,
  description:
    "Sort an inbox by category and priority, and spot which mails actually need a human reply.",
  stateLabel: "Email",
  questions: {
    category: choice("What is this email about?", [
      "billing",
      "technical issue",
      "sales inquiry",
      "partnership",
      "newsletter or spam",
    ]),
    priority: score("How urgent is this email?", [
      "low",
      "medium",
      "high",
      "urgent",
    ]),
    needsReply: noul("The sender expects a personal reply."),
    isAutomated: noul("This email was sent by an automated system."),
  },
  labels: {
    category: "Category",
    priority: "Priority",
    needsReply: "Needs reply",
    isAutomated: "Automated",
  },
  items: [
    {
      id: "e1",
      label: "Payment failed twice",
      meta: "from dana@brightloop.io",
      text: "Hi, our card was declined twice this morning even though it works everywhere else. We have a client demo at 2pm and the workspace is now locked. Can someone unlock it right away? Happy to pay by invoice if that is faster.",
    },
    {
      id: "e2",
      label: "Your weekly digest is here",
      meta: "from noreply@stackfeed.app",
      text: "Here is what happened in your workspaces this week: 14 new comments, 3 completed projects and 2 new members. You are receiving this because you subscribed to weekly digests. Unsubscribe at any time from your notification settings.",
    },
    {
      id: "e3",
      label: "Pricing for 40 seats",
      meta: "from m.okafor@northwind.co",
      text: "Hello, we are evaluating tools for our support team of about 40 people. Could you send over pricing for the business plan and let me know if you offer annual discounts? We would like to decide by the end of the quarter.",
    },
    {
      id: "e4",
      label: "Export button does nothing",
      meta: "from tom@wildoak.studio",
      text: "Since yesterday's update the CSV export button just spins and never downloads anything. Tried Chrome and Firefox, cleared cache. Not blocking us today but we need the exports for month-end reporting next week.",
    },
    {
      id: "e5",
      label: "Guest post opportunity",
      meta: "from outreach@linkgrowth.biz",
      text: "Hi there! I came across your blog and loved it. I would like to contribute a high-quality guest post with a do-follow link to our client. We can also offer a bulk deal for 10 articles. Let me know your rates!",
    },
  ],
  summarize: (answers) => {
    const category = asChoice(answers, "category");
    const priority = asScore(answers, "priority");
    const needsReply = asNoul(answers, "needsReply");
    return {
      headline: `${priority.level} · ${category.choice}`,
      tone: PRIORITY_TONES[priority.level] ?? "periwinkle",
      detail: needsReply.answer ? "Reply needed" : "No reply needed",
    };
  },
  code: `import { OpenJev, choice, noul, score } from "open-jev";

const jev = await OpenJev.load({ model: "kev-0.6b" });

const triage = await jev.decide(email.body, {
  category: choice("What is this email about?", [
    "billing",
    "technical issue",
    "sales inquiry",
    "partnership",
    "newsletter or spam",
  ]),
  priority: score("How urgent is this email?", [
    "low",
    "medium",
    "high",
    "urgent",
  ]),
  needsReply: noul("The sender expects a personal reply."),
  isAutomated: noul("This email was sent by an automated system."),
});

triage.category.choice; // "billing" | "technical issue" | ...
triage.priority.level; // "low" | "medium" | "high" | "urgent"
triage.priority.score; // 0..3, may fall between levels
triage.needsReply.answer; // boolean
triage.isAutomated.probability; // p(yes), 0..1`,
};

export default emailTriage;
