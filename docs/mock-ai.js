(function () {
  function clamp(num, min, max) {
    return Math.max(min, Math.min(max, num));
  }

  function analyzeUserMessage(text) {
    const msg = (text || "").toLowerCase();
    const score = {
      value: 0,
      context: 0,
      specificity: 0,
      business: 0
    };

    const valueWords = ["value", "benefit", "reduce", "improve", "faster", "visibility", "risk"];
    const contextWords = ["project", "director", "approval", "subcontractor", "compliance", "board", "timeline"];
    const specificWords = ["for example", "for instance", "in your", "weekly", "change-order", "workflow"];
    const businessWords = ["cost", "pricing", "budget", "margin", "roi", "save", "%", "days"];

    valueWords.forEach((w) => { if (msg.includes(w)) score.value += 1; });
    contextWords.forEach((w) => { if (msg.includes(w)) score.context += 1; });
    specificWords.forEach((w) => { if (msg.includes(w)) score.specificity += 1; });
    businessWords.forEach((w) => { if (msg.includes(w)) score.business += 1; });

    if (msg.length > 180) score.specificity += 1;
    if (msg.includes("because")) score.value += 1;

    return {
      value: clamp(score.value, 0, 4),
      context: clamp(score.context, 0, 4),
      specificity: clamp(score.specificity, 0, 3),
      business: clamp(score.business, 0, 3)
    };
  }

  function getCustomerOpening(customer) {
    return `I have 15 minutes. Everyone says their platform is \"integrated\". For ${customer.name}, what does VMS actually change in how this project is managed?`;
  }

  function getCustomerReply(turnCount, analysis, customer) {
    if (turnCount >= 6) {
      return "I need to jump to another call. Please wrap up what concrete result we should expect in the first month.";
    }

    if (analysis.value <= 1) {
      return "That still sounds generic. What specific problem in our current process does this solve first?";
    }

    if (analysis.context <= 1) {
      return `You're describing capabilities, but not our context. ${customer.pressure} How does your approach handle that?`;
    }

    if (analysis.business <= 0) {
      return "Understood. But if I present this internally, what business impact can I defend?";
    }

    if (analysis.specificity <= 1) {
      return "Better. Give me one concrete example of how my team would work differently next week.";
    }

    return "Okay, this is more concrete. Final question: what risk should I expect during adoption, and how do we control it?";
  }

  function generateReview(history, context) {
    const userMessages = history.filter((m) => m.role === "user");
    const cumulative = { value: 0, context: 0, specificity: 0, business: 0 };

    userMessages.forEach((message) => {
      const score = analyzeUserMessage(message.text);
      cumulative.value += score.value;
      cumulative.context += score.context;
      cumulative.specificity += score.specificity;
      cumulative.business += score.business;
    });

    const turns = Math.max(userMessages.length, 1);
    const avg = {
      value: cumulative.value / turns,
      context: cumulative.context / turns,
      specificity: cumulative.specificity / turns,
      business: cumulative.business / turns
    };

    const total = avg.value + avg.context + avg.specificity + avg.business;

    let outcome = "Yellow";
    if (total >= 8.2) outcome = "Green";
    if (total < 5.5) outcome = "Red";

    const unclear = [];
    const risk = [];
    const good = [];

    if (avg.value >= 2) good.push("You explained VMS in terms of project outcomes, not only features.");
    else unclear.push("Value story was broad and not anchored to the customer's first pain point.");

    if (avg.context >= 2) good.push(`You referenced ${context.customer.name}'s operating context.`);
    else {
      unclear.push("Customer-specific context (timeline, compliance, board pressure) was underused.");
      risk.push("Customer may classify the pitch as generic software positioning.");
    }

    if (avg.specificity >= 1.8) good.push("Your examples included actionable next-week workflow changes.");
    else {
      unclear.push("Examples were not concrete enough for operational buy-in.");
      risk.push("Project Director may delay decision due to unclear implementation picture.");
    }

    if (avg.business >= 1.5) good.push("You linked solution benefits to budget/risk logic.");
    else {
      risk.push("Lack of clear business logic makes internal championing difficult.");
    }

    const coachingMap = {
      context: {
        label: "Customer Context",
        tip: "Map VMS value to this customer's current friction: slipped timeline, approval lag, and cross-team visibility.",
        phrase: "For your project, VMS is less about another tool and more about shortening approval loops and exposing risk before it impacts milestones."
      },
      value: {
        label: "Product Value",
        tip: "Translate platform capability into one operational result in the first 30 days.",
        phrase: "In the first month, your team should see fewer late surprises because VMS highlights blockers at the workflow stage, not after reporting."
      },
      business: {
        label: "Pricing / Business Logic",
        tip: "Attach value to cost-of-delay and margin protection, even with a simple estimate.",
        phrase: "If we prevent even one week of delay on a critical package, the avoided cost typically outweighs the pilot investment."
      },
      specificity: {
        label: "Competitor Insight",
        tip: "Differentiate from generic dashboards by stressing decision workflow and accountability trace.",
        phrase: "Unlike reporting-only tools, VMS ties risk alerts to owners and due dates, so issues move instead of sitting in status decks."
      }
    };

    const weakest = Object.entries(avg).sort((a, b) => a[1] - b[1])[0][0];
    const coaching = coachingMap[weakest];

    return {
      outcome,
      goodPoints: good.length ? good : ["You maintained a professional, calm tone under pressure."],
      unclearPoints: unclear.length ? unclear : ["Minor clarity gaps remained in adoption risk explanation."],
      riskPoints: risk.length ? risk : ["No major risk flagged in this round."],
      coaching: {
        missingKnowledgeType: coaching.label,
        keyKnowledgeToAdd: coaching.tip,
        suggestedPhrasing: coaching.phrase,
        nextAction: "Retry this scenario and start by anchoring your first response to one concrete business pain and one measurable effect."
      }
    };
  }

  window.MockAI = {
    analyzeUserMessage,
    getCustomerOpening,
    getCustomerReply,
    generateReview
  };
})();
