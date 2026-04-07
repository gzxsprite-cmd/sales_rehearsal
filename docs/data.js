window.DEMO_DATA = {
  customers: [
    {
      id: "horizon",
      name: "华东启行汽车",
      background: "正在推进两款新能源平台车型，供应链协同压力大，采购部门要求在不增编情况下提升项目透明度。",
      projectNeed: "项目节奏紧、跨部门信息滞后，急需更早识别风险并缩短决策链路。"
    },
    {
      id: "summit",
      name: "峰驰智能出行",
      background: "海外项目增多，管理层要求研发、采购、制造三方同节奏推进 SOP。",
      projectNeed: "需要把关键节点问题前置暴露，避免 SOP 前集中爆雷。"
    },
    {
      id: "riverstone",
      name: "远石越野科技",
      background: "高端越野线扩张，试制变更多、质量风险高，项目总监要更强可追溯性。",
      projectNeed: "希望每周例会前就看到关键风险归属和闭环进度。"
    }
  ],
  futureModels: [
    { id: "m7", name: "M7", vehicleType: "SUV", energyType: "BEV", usage: "city" },
    { id: "s9", name: "S9", vehicleType: "sedan", energyType: "PHEV", usage: "business" },
    { id: "xtrail", name: "X-TRAIL R", vehicleType: "SUV", energyType: "HEV", usage: "off-road" },
    { id: "gt4", name: "GT4", vehicleType: "sedan", energyType: "ICE", usage: "track" },
    { id: "u8", name: "U8 Fleet", vehicleType: "SUV", energyType: "BEV", usage: "business" }
  ],
  targetRoles: ["采购总监", "项目总监"],
  products: ["VMS", "EMB", "BWA", "48V IPB"],
  scenarios: ["第一次介绍", "多次沟通后促成交易"],
  timeLimits: [10, 20, 30],
  labels: {
    vehicleType: { sedan: "轿车", SUV: "SUV" },
    energyType: { ICE: "燃油", BEV: "纯电", HEV: "混动", PHEV: "插混" },
    usage: { city: "城市通勤", track: "赛道性能", "off-road": "越野工况", business: "商务出行" }
  },
  referenceMaterials: {
    productIntro: {
      title: "VMS 产品介绍",
      body: [
        "# VMS 是什么",
        "VMS（Value Management System）用于把项目风险、节点进度和责任闭环放在同一工作台。",
        "",
        "## 适用场景",
        "- 多项目并行、跨部门协作复杂",
        "- 关键节点延期风险高",
        "- 需要周度可视化管理"
      ].join("\n")
    },
    valueSellingPoints: {
      title: "VMS 价值卖点",
      body: [
        "# 核心业务价值",
        "- 风险前置：问题在周例会前被识别，而不是事后补救",
        "- 决策提速：责任人、截止时间、影响范围一屏可见",
        "- 协同减负：减少跨部门反复确认与状态追问"
      ].join("\n")
    },
    competitorCompare: {
      title: "对比竞品 XXX",
      body: [
        "# 当客户提到“我们已有类似系统”",
        "- XXX 强在结果展示（看板/报表）",
        "- 我们强在过程闭环（风险触发 → 责任分派 → 截止追踪）",
        "- 可强调：不是多一个看板，而是让问题真正推进"
      ].join("\n")
    },
    businessArguments: {
      title: "业务论证话术",
      body: [
        "# 内部汇报可用说法",
        "1. 先算不做的代价：延期、返工、跨部门沟通损耗",
        "2. 再算试点投入：一个项目、一个月、最小闭环",
        "3. 用首月结果决定是否扩面"
      ].join("\n")
    }
  },
  reviewKnowledgeBase: {
    strengths: {
      value: "你把 VMS 从“系统功能”转成了“项目收益”，客户更容易理解继续沟通的意义。",
      context: "你有结合客户当前项目压力点（节点、协同、风险）来讲，贴合度较高。",
      specificity: "你给出了阶段性推进动作，客户能想象落地路径。",
      championing: "你补充了内部汇报视角，有助于客户成为内部推动者。"
    },
    gaps: {
      value: "还没明确说明“为什么这个项目现在就需要 VMS”。",
      context: "客户背景引用不足，话术听起来偏通用。",
      specificity: "缺少按周或按里程碑的具体动作与结果。",
      championing: "内部立项理由不够强，客户难向上汇报。"
    },
    risks: {
      value: "客户可能认为价值不紧迫，倾向继续观望。",
      context: "客户会觉得方案与当前项目关联度不足。",
      specificity: "客户担心实施路径不清晰，推进节奏不可控。",
      championing: "缺少业务账，内部支持者难以争取预算。"
    },
    coaching: {
      value: {
        type: "产品价值表达",
        tip: "先说“首月可验证结果”，再讲功能细节。",
        phrase: "对你们这个项目，VMS 首月目标是把关键风险前移到周例会前，确保问题有人接、按时闭环。"
      },
      context: {
        type: "客户项目理解",
        tip: "开场先复述客户当前压力，让客户先认同你理解场景。",
        phrase: "结合你们当前跨部门协同和节点压力，VMS 优先解决的是风险定位慢、责任不清的问题。"
      },
      specificity: {
        type: "落地路径设计",
        tip: "给出“第一周、第二周、第三周”的执行节奏。",
        phrase: "第一周梳理风险节点，第二周上线责任闭环，第三周用周报验证项目节奏是否改善。"
      },
      championing: {
        type: "内部推动论证",
        tip: "补上“不做损失 vs 试点投入”的业务账，帮助客户向上汇报。",
        phrase: "只要减少一次关键节点延期，避免的损失通常就能覆盖试点投入，这笔账可以按单项目先算清。"
      }
    }
  }
};
