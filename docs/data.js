window.DEMO_DATA = {
  customers: [
    {
      id: "horizon",
      name: "华东启行汽车",
      background: "正在推进两款新能源平台车型，供应链协同压力大，采购部门要求在不增编的情况下提升项目透明度。"
    },
    {
      id: "summit",
      name: "峰驰智能出行",
      background: "海外项目增多，管理层要求研发、采购、制造三方在同一节奏下推进 SOP，减少跨团队扯皮。"
    },
    {
      id: "riverstone",
      name: "远石越野科技",
      background: "高端越野线扩张，试制变更多、质量风险高，项目总监希望更早暴露关键风险点。"
    },
    {
      id: "nova",
      name: "新曜商用车",
      background: "商用车平台升级，客户交期硬约束明显，采购负责人关注成本波动和关键件交付风险。"
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
  }
};
