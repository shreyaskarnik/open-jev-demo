import { MessageSquareWarning } from "lucide-react";
import { choice, noul, score } from "open-jev";
import { asChoice, asNoul, asScore } from "./answers";
import type { DemoDefinition, Tone } from "./types";

const ACTION_TONES: Record<string, Tone> = {
  approve: "mint",
  "needs review": "lavender",
  remove: "rose",
};

const commentModeration: DemoDefinition = {
  id: "comment-moderation",
  title: "Comment moderation",
  tag: "Community",
  tone: "periwinkle",
  icon: MessageSquareWarning,
  description:
    "Approve, flag or remove user comments and tag each one with a calibrated sentiment level.",
  stateLabel: "Comment",
  questions: {
    action: choice(
      "What should a moderator do with this comment?",
      ["approve", "needs review", "remove"],
      {
        approve: "civil and on topic",
        "needs review": "borderline, a human should look at it",
        remove: "harassment, hate, threats or spam",
      }
    ),
    sentiment: score("How positive is the sentiment of this comment?", [
      "very negative",
      "negative",
      "neutral",
      "positive",
      "very positive",
    ]),
    toxic: noul("Is this comment abusive?"),
    spam: noul("The comment promotes a product, offer or link."),
  },
  labels: {
    action: "Action",
    sentiment: "Sentiment",
    toxic: "Toxic",
    spam: "Spam",
  },
  items: [
    {
      id: "c1",
      label: "@maya_reads",
      meta: 'on "Our 2026 roadmap"',
      text: "Honestly this is the best update you have shipped in years. The offline mode alone saves me hours every week. Thank you for actually listening to feedback!",
    },
    {
      id: "c2",
      label: "@grumpy_dev",
      meta: 'on "Our 2026 roadmap"',
      text: "Another roadmap, another year of the same bugs. I have reported the sync issue four times. Not angry, just tired. Please fix the basics before adding AI features.",
    },
    {
      id: "c3",
      label: "@kingsley99",
      meta: 'on "Community guidelines"',
      text: "Whoever wrote this is a clueless idiot. Get a real job, nobody asked for your worthless opinion. People like you ruin every forum.",
    },
    {
      id: "c4",
      label: "@dealsdaily",
      meta: 'on "Community guidelines"',
      text: "Make $500 a day from home!!! Limited spots, click the link in my profile now and use code FAST50 for a bonus. Don't miss out!!!",
    },
    {
      id: "c5",
      label: "@renata.v",
      meta: 'on "Pricing changes"',
      text: "I get that prices go up, but a 40% jump with two weeks notice is rough for small teams. Would a grandfathered plan be possible? Otherwise we'll probably have to look elsewhere.",
    },
  ],
  summarize: (answers) => {
    const action = asChoice(answers, "action");
    const sentiment = asScore(answers, "sentiment");
    const toxic = asNoul(answers, "toxic");
    return {
      headline: action.choice,
      tone: ACTION_TONES[action.choice] ?? "periwinkle",
      detail: toxic.answer ? "Toxic" : sentiment.level,
    };
  },
  code: `import { OpenJev, choice, noul, score } from "open-jev";

const jev = await OpenJev.load({ model: "kev-0.6b" });

const [action, sentiment, toxic, spam] = await jev.decide(comment, [
  choice(
    "What should a moderator do with this comment?",
    ["approve", "needs review", "remove"],
    {
      approve: "civil and on topic",
      "needs review": "borderline, a human should look at it",
      remove: "harassment, hate, threats or spam",
    }
  ),
  score("How positive is the sentiment of this comment?", [
    "very negative",
    "negative",
    "neutral",
    "positive",
    "very positive",
  ]),
  noul("Is this comment abusive?"),
  noul("The comment promotes a product, offer or link."),
]);

action.choice; // "approve" | "needs review" | "remove"
action.probabilities; // { approve: 0.03, "needs review": 0.11, remove: 0.86 }
sentiment.normalized; // 0..1 across the five levels
toxic.answer && spam.answer; // both plain booleans`,
};

export default commentModeration;
