(function () {
  const state = {
    step: "start",
    context: null,
    history: [],
    turnCount: 0,
    startedAt: null,
    timer: null
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
    modelOptions: document.getElementById("modelOptions"),
    roleSelect: document.getElementById("roleSelect"),
    productSelect: document.getElementById("productSelect"),
    scenarioSelect: document.getElementById("scenarioSelect"),
    timeSelect: document.getElementById("timeSelect"),
    chatContext: document.getElementById("chatContext"),
    chatLog: document.getElementById("chatLog"),
    chatInput: document.getElementById("chatInput"),
    timerBadge: document.getElementById("timerBadge"),
    outcomeBadge: document.getElementById("outcomeBadge"),
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
    const showTopRestart = step === "chat" || step === "review";
    els.restartTopBtn.classList.toggle("hidden", !showTopRestart);
  }

  function appendOptions(target, options, selectedIndex) {
    options.forEach((item, index) => {
      const option = document.createElement("option");
      const value = typeof item === "string" ? item : item.id;
      const label = typeof item === "string" ? item : item.name;
      option.value = value;
      option.textContent = label;
      if (index === selectedIndex) option.selected = true;
      target.append(option);
    });
  }

  function updateCustomerBackground() {
    const customer = DEMO_DATA.customers.find((c) => c.id === els.customerSelect.value);
    els.customerBackground.textContent = customer ? customer.background : "";
  }

  function renderModelOptions() {
    els.modelOptions.innerHTML = "";

    DEMO_DATA.futureModels.forEach((model, index) => {
      const label = document.createElement("label");
      label.className = "model-card";

      const input = document.createElement("input");
      input.type = "checkbox";
      input.value = model.id;
      if (index < 2) input.checked = true;

      const content = document.createElement("div");
      const vehicle = DEMO_DATA.labels.vehicleType[model.vehicleType];
      const energy = DEMO_DATA.labels.energyType[model.energyType];
      const usage = DEMO_DATA.labels.usage[model.usage];
      content.innerHTML = `<strong>${model.name}</strong><div class="model-meta">${vehicle}｜${energy}｜${usage}</div>`;

      input.addEventListener("change", () => {
        label.classList.toggle("selected", input.checked);
      });

      label.classList.toggle("selected", input.checked);
      label.append(input, content);
      els.modelOptions.append(label);
    });
  }

  function renderInitialSetup() {
    appendOptions(els.customerSelect, DEMO_DATA.customers, 0);
    appendOptions(els.roleSelect, DEMO_DATA.targetRoles, 1);
    appendOptions(els.productSelect, DEMO_DATA.products, 0);
    appendOptions(els.scenarioSelect, DEMO_DATA.scenarios, 0);
    appendOptions(els.timeSelect, DEMO_DATA.timeLimits.map((m) => `${m} 分钟`), 1);
    [...els.timeSelect.options].forEach((opt, idx) => {
      opt.value = String(DEMO_DATA.timeLimits[idx]);
    });

    renderModelOptions();
    updateCustomerBackground();
  }

  function getSelectedModels() {
    const selectedIds = [...els.modelOptions.querySelectorAll("input:checked")].map((input) => input.value);
    if (!selectedIds.length) {
      const first = els.modelOptions.querySelector("input");
      if (first) {
        first.checked = true;
        first.parentElement.classList.add("selected");
        selectedIds.push(first.value);
      }
    }
    return DEMO_DATA.futureModels.filter((m) => selectedIds.includes(m.id));
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

  function addChatMessage(role, text) {
    state.history.push({ role, text, at: new Date().toISOString() });

    const bubble = document.createElement("div");
    bubble.className = `bubble ${role}`;
    const meta = role === "customer" ? state.context.role : "你";
    bubble.innerHTML = `<span class="meta">${meta}</span>${text}`;
    els.chatLog.append(bubble);
    els.chatLog.scrollTop = els.chatLog.scrollHeight;
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

  function renderTimer() {
    if (!state.startedAt || !state.context) return;

    const elapsedSec = Math.floor((Date.now() - state.startedAt.getTime()) / 1000);
    const maxSec = state.context.timeLimit * 60;
    const remain = Math.max(0, maxSec - elapsedSec);

    const mm = String(Math.floor(remain / 60)).padStart(2, "0");
    const ss = String(remain % 60).padStart(2, "0");
    els.timerBadge.textContent = `${mm}:${ss}`;

    if (remain === 0) {
      endConversation("时间到了，我们先到这里。建议你下轮把开场价值点再收紧一点。");
    }
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
    const customerReply = MockAI.getCustomerReply(state.turnCount, analysis, state.context);
    window.setTimeout(() => addChatMessage("customer", customerReply), 280);

    if (state.turnCount >= 7) {
      window.setTimeout(() => endConversation("我这边要去下个会了。请把这版话术再打磨一下，我们下轮继续。"), 700);
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

  function endConversation(optionalFinalMessage) {
    if (state.step !== "chat") return;
    if (optionalFinalMessage) addChatMessage("customer", optionalFinalMessage);

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
    document.getElementById("chatInput").addEventListener("keydown", (event) => {
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
