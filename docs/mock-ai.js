(function () {
  function clamp(num, min, max) {
    return Math.max(min, Math.min(max, num));
  }

  function analyzeUserMessage(text) {
    const msg = (text || "").toLowerCase();
    const score = { value: 0, context: 0, specificity: 0, championing: 0 };

    const valueWords = ["价值", "收益", "效率", "风险前置", "缩短", "闭环", "节奏"];
    const contextWords = ["项目", "采购", "节点", "交付", "sop", "协同", "变更", "你们"];
    const specificWords = ["第一周", "第二周", "首月", "里程碑", "具体", "例如", "负责"];
    const championWords = ["汇报", "预算", "投入", "损失", "试点", "立项", "管理层", "赢单"];

    valueWords.forEach((w) => msg.includes(w) && (score.value += 1));
    contextWords.forEach((w) => msg.includes(w) && (score.context += 1));
    specificWords.forEach((w) => msg.includes(w) && (score.specificity += 1));
    championWords.forEach((w) => msg.includes(w) && (score.championing += 1));

    if (msg.length > 100) score.specificity += 1;
    if (msg.includes("因为") || msg.includes("所以")) score.value += 1;

    return {
      value: clamp(score.value, 0, 4),
      context: clamp(score.context, 0, 4),
      specificity: clamp(score.specificity, 0, 3),
      championing: clamp(score.championing, 0, 3)
    };
  }

  function getCustomerOpening(context) {
    return `我们先直奔主题。你今天想推 ${context.product}，面向 ${context.role}。请你先回答：为什么 ${context.customer.name} 这个项目现在就需要 VMS？`;
  }

  function getCustomerReply(turnCount, analysis, context) {
    if (turnCount >= 6) return "我还有 5 分钟。请你用“业务价值 + 落地路径 + 内部汇报理由”三句话收口。";
    if (analysis.value <= 1) return "你讲了功能，但没有回答“为什么现在必须做”。";
    if (analysis.context <= 1) return `你没贴住我们项目。${context.customer.projectNeed}`;
    if (analysis.specificity <= 1) return "方向可以，但我需要更具体：第一周谁做什么、看什么结果？";
    if (analysis.championing <= 0) return "如果我要推动内部立项，我该怎么向管理层讲这笔账？";
    return "这版更像可落地方案了。最后你说下，和竞品 XXX 比我们赢在哪里？";
  }

  function generateReview(history, context) {
    const kb = DEMO_DATA.reviewKnowledgeBase;
    const userMessages = history.filter((item) => item.role === "user");
    const sum = { value: 0, context: 0, specificity: 0, championing: 0 };

    userMessages.forEach((item) => {
      const a = analyzeUserMessage(item.text);
      sum.value += a.value;
      sum.context += a.context;
      sum.specificity += a.specificity;
      sum.championing += a.championing;
    });

    const turns = Math.max(userMessages.length, 1);
    const avg = {
      value: sum.value / turns,
      context: sum.context / turns,
      specificity: sum.specificity / turns,
      championing: sum.championing / turns
    };

    const weighted = avg.value * 24 + avg.context * 24 + avg.specificity * 22 + avg.championing * 30;
    const winRate = clamp(Math.round(22 + weighted / 4), 18, 92);

    let outcome = "黄灯：可继续推进";
    let outcomeClass = "Yellow";
    if (winRate >= 72) {
      outcome = "绿灯：继续推进概率高";
      outcomeClass = "Green";
    } else if (winRate <= 45) {
      outcome = "红灯：当前说服力不足";
      outcomeClass = "Red";
    }

    const goodPoints = [];
    const unclearPoints = [];
    const riskPoints = [];

    if (avg.value >= 2) goodPoints.push(kb.strengths.value);
    else {
      unclearPoints.push(kb.gaps.value);
      riskPoints.push(kb.risks.value);
    }

    if (avg.context >= 2) goodPoints.push(kb.strengths.context);
    else {
      unclearPoints.push(kb.gaps.context);
      riskPoints.push(kb.risks.context);
    }

    if (avg.specificity >= 1.7) goodPoints.push(kb.strengths.specificity);
    else {
      unclearPoints.push(kb.gaps.specificity);
      riskPoints.push(kb.risks.specificity);
    }

    if (avg.championing >= 1.5) goodPoints.push(kb.strengths.championing);
    else {
      unclearPoints.push(kb.gaps.championing);
      riskPoints.push(kb.risks.championing);
    }

    const weakestKey = Object.entries(avg).sort((a, b) => a[1] - b[1])[0][0];
    const coaching = kb.coaching[weakestKey];

    return {
      outcome,
      outcomeClass,
      winRate,
      goodPoints: goodPoints.length ? goodPoints : ["你保持了稳定沟通节奏，客户愿意继续听下去。"],
      unclearPoints: unclearPoints.length ? unclearPoints : ["可继续补充对竞品和落地边界的说明。"],
      riskPoints: riskPoints.length ? riskPoints : ["当前未出现明显阻断点，可进入下一轮深谈。"],
      coaching: {
        missingKnowledgeType: `待补强知识类型：${coaching.type}`,
        keyKnowledgeToAdd: `建议补充：${coaching.tip}`,
        suggestedPhrasing: coaching.phrase,
        nextAction: `建议：针对 ${context.customer.name} 再练一轮，目标把模拟赢单率提升到 70% 以上。`
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
