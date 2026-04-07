(function () {
  const state = {
    step: "start",
    context: null,
    history: [],
    turnCount: 0,
    startedAt: null,
    timer: null,
    activeRefKey: "productIntro"
  };

  const views = {
    start: document.getElementById("startView"),
    chat: document.getElementById("chatView"),
    review: document.getElementById("reviewView")
  };

  const els = {
    restartTopBtn: document.getElementById("restartTopBtn"),
    customerSelect: document.getElementById("customerSelect"),
    customerBackground: document.getElementById("customerBackground"),
    modelList: document.getElementById("modelList"),
    roleSelect: document.getElementById("roleSelect"),
    productSelect: document.getElementById("productSelect"),
    scenarioSelect: document.getElementById("scenarioSelect"),
    timeSelect: document.getElementById("timeSelect"),
    chatContext: document.getElementById("chatContext"),
    chatLog: document.getElementById("chatLog"),
    chatInput: document.getElementById("chatInput"),
    timerBadge: document.getElementById("timerBadge"),
    refTabs: document.getElementById("refTabs"),
    refContent: document.getElementById("refContent"),
    outcomeBadge: document.getElementById("outcomeBadge"),
    winRate: document.getElementById("winRate"),
    goodPoints: document.getElementById("goodPoints"),
    unclearPoints: document.getElementById("unclearPoints"),
    riskPoints: document.getElementById("riskPoints"),
    missingType: document.getElementById("missingType"),
    knowledgeToAdd: document.getElementById("knowledgeToAdd"),
    suggestedPhrase: document.getElementById("suggestedPhrase"),
    nextAction: document.getElementById("nextAction")
  };

  function setStep(step) {
    Object.values(views).forEach((view) => view.classList.remove("active"));
    views[step].classList.add("active");
    state.step = step;
    els.restartTopBtn.classList.toggle("hidden", !(step === "chat" || step === "review"));
  }

  function appendOptions(target, options, selectedIndex) {
    options.forEach((item, index) => {
      const option = document.createElement("option");
      const value = typeof item === "string" ? item : item.id;
      const label = typeof item === "string" ? item : item.name;
      option.value = value;
      option.textContent = label;
      option.selected = index === selectedIndex;
      target.append(option);
    });
  }

  function updateCustomerBackground() {
    const customer = DEMO_DATA.customers.find((c) => c.id === els.customerSelect.value);
    els.customerBackground.textContent = customer ? `${customer.background} ${customer.projectNeed}` : "";
  }

  function renderModelList() {
    els.modelList.innerHTML = "";

    DEMO_DATA.futureModels.forEach((model, index) => {
      const row = document.createElement("label");
      row.className = "model-row";

      const checkboxWrap = document.createElement("span");
      const input = document.createElement("input");
      input.type = "checkbox";
      input.value = model.id;
      if (index < 2) input.checked = true;
      checkboxWrap.append(input);

      const name = document.createElement("span");
      name.textContent = model.name;

      const vType = document.createElement("span");
      vType.innerHTML = `<span class="model-tag">${DEMO_DATA.labels.vehicleType[model.vehicleType]}</span>`;

      const eType = document.createElement("span");
      eType.innerHTML = `<span class="model-tag">${DEMO_DATA.labels.energyType[model.energyType]}</span>`;

      const usage = document.createElement("span");
      usage.innerHTML = `<span class="model-tag">${DEMO_DATA.labels.usage[model.usage]}</span>`;

      input.addEventListener("change", () => row.classList.toggle("selected", input.checked));
      row.classList.toggle("selected", input.checked);
      row.append(checkboxWrap, name, vType, eType, usage);
      els.modelList.append(row);
    });
  }

  function renderReferenceTabs() {
    const refs = DEMO_DATA.referenceMaterials;
    els.refTabs.innerHTML = "";
    Object.keys(refs).forEach((key, idx) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "ref-tab";
      button.textContent = refs[key].title;
      if (idx === 0) state.activeRefKey = key;
      if (state.activeRefKey === key) button.classList.add("active");
      button.addEventListener("click", () => {
        state.activeRefKey = key;
        renderReferenceTabs();
        renderReferenceContent();
      });
      els.refTabs.append(button);
    });
    renderReferenceContent();
  }

  function renderMarkdownLike(raw) {
    return raw
      .split("\n")
      .map((line) => {
        if (line.startsWith("# ")) return `<div class="md-h1">${line.slice(2)}</div>`;
        if (line.startsWith("## ")) return `<div class="md-h2">${line.slice(3)}</div>`;
        if (line.startsWith("- ")) return `<div class="md-li">• ${line.slice(2)}</div>`;
        if (!line.trim()) return "<div>&nbsp;</div>";
        return `<div>${line}</div>`;
      })
      .join("");
  }

  function renderReferenceContent() {
    const item = DEMO_DATA.referenceMaterials[state.activeRefKey];
    els.refContent.innerHTML = renderMarkdownLike(item.body);
  }

  function renderInitialSetup() {
    appendOptions(els.customerSelect, DEMO_DATA.customers, 0);
    appendOptions(els.roleSelect, DEMO_DATA.targetRoles, 1);
    appendOptions(els.productSelect, DEMO_DATA.products, 0);
    appendOptions(els.scenarioSelect, DEMO_DATA.scenarios, 0);
    appendOptions(els.timeSelect, DEMO_DATA.timeLimits.map((m) => `${m} 分钟`), 1);
    [...els.timeSelect.options].forEach((option, idx) => {
      option.value = String(DEMO_DATA.timeLimits[idx]);
    });

    renderModelList();
    renderReferenceTabs();
    updateCustomerBackground();
  }

  function getSelectedModels() {
    const selected = [...els.modelList.querySelectorAll("input:checked")].map((input) => input.value);
    if (!selected.length) {
      const first = els.modelList.querySelector("input");
      if (first) {
        first.checked = true;
        first.closest(".model-row").classList.add("selected");
        selected.push(first.value);
      }
    }
    return DEMO_DATA.futureModels.filter((m) => selected.includes(m.id));
  }

  function getSelectedContext() {
    const customer = DEMO_DATA.customers.find((c) => c.id === els.customerSelect.value);
    return {
      customer,
      models: getSelectedModels(),
      role: els.roleSelect.value,
      product: els.productSelect.value,
      scenario: els.scenarioSelect.value,
      timeLimit: Number(els.timeSelect.value)
    };
  }

  function renderChatContext() {
    const tags = [
      `客户：${state.context.customer.name}`,
      `车型：${state.context.models.map((m) => m.name).join(" / ")}`,
      `角色：${state.context.role}`,
      `产品：${state.context.product}`,
      `场景：${state.context.scenario}`,
      `时长：${state.context.timeLimit} 分钟`
    ];
    els.chatContext.innerHTML = "";
    tags.forEach((tag) => {
      const span = document.createElement("span");
      span.textContent = tag;
      els.chatContext.append(span);
    });
  }

  function addChatMessage(role, text) {
    state.history.push({ role, text, at: new Date().toISOString() });

    const bubble = document.createElement("div");
    bubble.className = `bubble ${role}`;
    bubble.innerHTML = `<span class="meta">${role === "customer" ? state.context.role : "你"}</span>${text}`;
    els.chatLog.append(bubble);
    els.chatLog.scrollTop = els.chatLog.scrollHeight;
  }

  function renderTimer() {
    if (!state.startedAt || !state.context) return;
    const elapsedSec = Math.floor((Date.now() - state.startedAt.getTime()) / 1000);
    const remain = Math.max(0, state.context.timeLimit * 60 - elapsedSec);

    const mm = String(Math.floor(remain / 60)).padStart(2, "0");
    const ss = String(remain % 60).padStart(2, "0");
    els.timerBadge.textContent = `${mm}:${ss}`;

    if (remain === 0) endConversation("时间到了，这轮先到这里。你可以基于右侧资料再练一轮。");
  }

  function startTimer() {
    clearInterval(state.timer);
    renderTimer();
    state.timer = setInterval(renderTimer, 1000);
  }

  function stopTimer() {
    clearInterval(state.timer);
    state.timer = null;
  }

  function startConversation() {
    state.context = getSelectedContext();
    state.history = [];
    state.turnCount = 0;
    state.startedAt = new Date();
    els.chatLog.innerHTML = "";
    els.chatInput.value = "";

    renderChatContext();
    setStep("chat");
    startTimer();
    addChatMessage("customer", MockAI.getCustomerOpening(state.context));
  }

  function submitUserMessage() {
    const text = els.chatInput.value.trim();
    if (!text) return;

    addChatMessage("user", text);
    els.chatInput.value = "";
    state.turnCount += 1;

    const analysis = MockAI.analyzeUserMessage(text);
    const reply = MockAI.getCustomerReply(state.turnCount, analysis, state.context);
    setTimeout(() => addChatMessage("customer", reply), 280);

    if (state.turnCount >= 7) {
      setTimeout(() => endConversation("我这边要去下个会了。你把重点再收敛一下，我们可以继续谈。"), 700);
    }
  }

  function renderList(target, items) {
    target.innerHTML = "";
    items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      target.append(li);
    });
  }

  function renderReview(review) {
    els.winRate.textContent = `${review.winRate}%`;
    els.outcomeBadge.textContent = `结果：${review.outcome}`;
    els.outcomeBadge.className = "outcome-badge";
    els.outcomeBadge.classList.add(`outcome-${review.outcomeClass.toLowerCase()}`);

    renderList(els.goodPoints, review.goodPoints);
    renderList(els.unclearPoints, review.unclearPoints);
    renderList(els.riskPoints, review.riskPoints);

    els.missingType.textContent = review.coaching.missingKnowledgeType;
    els.knowledgeToAdd.textContent = review.coaching.keyKnowledgeToAdd;
    els.suggestedPhrase.textContent = review.coaching.suggestedPhrasing;
    els.nextAction.textContent = review.coaching.nextAction;
  }

  function endConversation(optionalFinal) {
    if (state.step !== "chat") return;
    if (optionalFinal) addChatMessage("customer", optionalFinal);

    stopTimer();
    const review = MockAI.generateReview(state.history, state.context);
    renderReview(review);
    setStep("review");
  }

  function resetToStart() {
    stopTimer();
    state.context = null;
    state.history = [];
    state.turnCount = 0;
    state.startedAt = null;
    setStep("start");
  }

  function bindEvents() {
    els.customerSelect.addEventListener("change", updateCustomerBackground);
    document.getElementById("startBtn").addEventListener("click", startConversation);
    document.getElementById("sendBtn").addEventListener("click", submitUserMessage);
    els.chatInput.addEventListener("keydown", (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") submitUserMessage();
    });
    document.getElementById("endChatBtn").addEventListener("click", () => endConversation());
    document.getElementById("retryBtn").addEventListener("click", startConversation);
    document.getElementById("newRunBtn").addEventListener("click", resetToStart);
    els.restartTopBtn.addEventListener("click", resetToStart);
  }

  renderInitialSetup();
  bindEvents();
})();
