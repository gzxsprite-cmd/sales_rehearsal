(function () {
  function clamp(num, min, max) {
    return Math.max(min, Math.min(max, num));
  }

  function analyzeUserMessage(text) {
    const msg = (text || "").toLowerCase();
    const score = { value: 0, context: 0, specificity: 0, business: 0 };

    const valueWords = ["价值", "提升", "效率", "缩短", "风险", "收益", "透明"];
    const contextWords = ["采购", "项目", "sop", "交付", "变更", "供应链", "客户"];
    const specificWords = ["例如", "比如", "第一周", "一个月", "具体", "流程", "节点"];
    const businessWords = ["成本", "预算", "毛利", "回报", "roi", "现金", "延期", "损失"];

    valueWords.forEach((w) => msg.includes(w) && (score.value += 1));
    contextWords.forEach((w) => msg.includes(w) && (score.context += 1));
    specificWords.forEach((w) => msg.includes(w) && (score.specificity += 1));
    businessWords.forEach((w) => msg.includes(w) && (score.business += 1));

    if (msg.length > 90) score.specificity += 1;
    if (msg.includes("因为")) score.value += 1;

    return {
      value: clamp(score.value, 0, 4),
      context: clamp(score.context, 0, 4),
      specificity: clamp(score.specificity, 0, 3),
      business: clamp(score.business, 0, 3)
    };
  }

  function getCustomerOpening(context) {
    return `我们时间不多。你今天主推 ${context.product}，面向 ${context.role}。请直接说：对 ${context.customer.name} 当前项目，第一阶段最实际的价值是什么？`;
  }

  function getCustomerReply(turnCount, analysis, context) {
    if (turnCount >= 6) {
      return "我还有 5 分钟，请你收口：首月可落地结果和我们要承担的风险分别是什么？";
    }
    if (analysis.value <= 1) return "听起来还是偏概念。你先说一个我们当前最痛的点，怎么被解决。";
    if (analysis.context <= 1) return `你没贴住我们的实际背景。${context.customer.background}`;
    if (analysis.business <= 0) return "如果我要给管理层汇报，这件事的成本逻辑怎么讲？";
    if (analysis.specificity <= 1) return "给我一个更具体的推进方式，最好按周来讲。";

    return "这个方向可以。最后一个问题：如果推进不顺，最大的落地风险是什么，你怎么兜底？";
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
    let outcome = "黄灯：可继续推进";
    let outcomeClass = "Yellow";
    if (total >= 8.2) {
      outcome = "绿灯：客户愿意继续";
      outcomeClass = "Green";
    }
    if (total < 5.5) {
      outcome = "红灯：说服力不足";
      outcomeClass = "Red";
    }

    const good = [];
    const unclear = [];
    const risk = [];

    if (avg.value >= 2) good.push("你能把产品能力转成业务价值，而不是只讲功能。");
    else unclear.push("价值表达还偏泛，没先抓住客户当前最紧急的问题。");

    if (avg.context >= 2) good.push(`你有结合 ${context.customer.name} 的项目背景去沟通。`);
    else {
      unclear.push("对客户背景利用不足，听起来像通用介绍。");
      risk.push("客户可能认为方案和自身情况关联度不高。");
    }

    if (avg.specificity >= 1.8) good.push("你给到了可执行的推进动作，便于客户内部讨论。");
    else {
      unclear.push("缺少清晰的时间节奏和落地动作。");
      risk.push("客户担心推进节奏不可控，可能继续观望。");
    }

    if (avg.business >= 1.5) good.push("你有覆盖成本/收益逻辑，方便客户向上汇报。");
    else risk.push("缺少业务账，采购或管理层难以快速拍板。");

    const coachingMap = {
      context: {
        label: "客户背景理解",
        tip: "把客户当前组织压力（交付、协同、变更）放进第一句话，让客户先点头。",
        phrase: `你们当前最大的压力是“项目节奏和跨团队协同”。${context.product} 先解决这个问题，再谈扩展价值。`
      },
      value: {
        label: "产品价值表达",
        tip: "从“功能介绍”改为“首月结果”，先说一个可验证成果。",
        phrase: "首月我们先把关键节点风险前移，确保项目例会前就能看到问题责任人和处理进度。"
      },
      business: {
        label: "商业逻辑",
        tip: "补充成本对比：不做的损失 vs 试点投入，帮助客户内部立项。",
        phrase: "只要减少一次关键延期，避免的损失通常就能覆盖试点投入，这笔账可以先按单项目核算。"
      },
      specificity: {
        label: "竞品差异与落地路径",
        tip: "明确“第一周做什么、谁参与、如何验收”，减少客户不确定感。",
        phrase: "第一周我们先梳理关键风险节点，第二周上线最小闭环，第三周用周报验证是否真正缩短决策链路。"
      }
    };

    const weakest = Object.entries(avg).sort((a, b) => a[1] - b[1])[0][0];
    const coaching = coachingMap[weakest];

    return {
      outcome,
      outcomeClass,
      goodPoints: good.length ? good : ["沟通语气稳定，能够持续跟进客户问题。"],
      unclearPoints: unclear.length ? unclear : ["可补充实施风险和协作边界说明。"],
      riskPoints: risk.length ? risk : ["本轮未出现明显推进风险。"],
      coaching: {
        missingKnowledgeType: `待补强知识类型：${coaching.label}`,
        keyKnowledgeToAdd: coaching.tip,
        suggestedPhrasing: coaching.phrase,
        nextAction: "建议：马上再练一轮，开场 30 秒先讲客户痛点 + 首月结果 + 商业账。"
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
