(function () {
  const state = {
    step: "home",
    context: null,
    history: [],
    turnCount: 0,
    startedAt: null,
    timer: null
  };

  const views = {
    home: document.getElementById("homeView"),
    setup: document.getElementById("setupView"),
    chat: document.getElementById("chatView"),
    review: document.getElementById("reviewView")
  };

  const els = {
    restartTopBtn: document.getElementById("restartTopBtn"),
    customerSelect: document.getElementById("customerSelect"),
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

  function renderOptions() {
    DEMO_DATA.customers.forEach((customer, index) => {
      const option = document.createElement("option");
      option.value = customer.id;
      option.textContent = `${customer.name} — ${customer.profile}`;
      if (index === 0) option.selected = true;
      els.customerSelect.append(option);
    });

    DEMO_DATA.timeLimits.forEach((minutes, index) => {
      const option = document.createElement("option");
      option.value = String(minutes);
      option.textContent = `${minutes} minutes`;
      if (index === 1) option.selected = true;
      els.timeSelect.append(option);
    });
  }

  function setStep(step) {
    Object.values(views).forEach((view) => view.classList.remove("active"));
    views[step].classList.add("active");
    state.step = step;
    const showTopRestart = step === "chat" || step === "review";
    els.restartTopBtn.classList.toggle("hidden", !showTopRestart);
  }

  function getSelectedContext() {
    const customer = DEMO_DATA.customers.find((c) => c.id === els.customerSelect.value);
    const timeLimit = Number(els.timeSelect.value);
    return {
      customer,
      timeLimit,
      product: DEMO_DATA.product,
      role: DEMO_DATA.role,
      scenario: DEMO_DATA.scenario
    };
  }

  function addChatMessage(role, text) {
    state.history.push({ role, text, at: new Date().toISOString() });

    const bubble = document.createElement("div");
    bubble.className = `bubble ${role}`;
    const meta = role === "customer" ? state.context.role : "You";
    bubble.innerHTML = `<span class="meta">${meta}</span>${text}`;
    els.chatLog.append(bubble);
    els.chatLog.scrollTop = els.chatLog.scrollHeight;
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
      endConversation("We are out of time. Thanks, let's reconnect after you tighten this for our context.");
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

    els.chatContext.textContent = `${state.context.customer.name} • ${state.context.product} • ${state.context.scenario} • ${state.context.timeLimit} min`;

    setStep("chat");
    startTimer();

    addChatMessage("customer", MockAI.getCustomerOpening(state.context.customer));
  }

  function submitUserMessage() {
    const text = els.chatInput.value.trim();
    if (!text) return;

    addChatMessage("user", text);
    els.chatInput.value = "";
    state.turnCount += 1;

    const analysis = MockAI.analyzeUserMessage(text);
    const customerReply = MockAI.getCustomerReply(state.turnCount, analysis, state.context.customer);
    window.setTimeout(() => addChatMessage("customer", customerReply), 300);

    if (state.turnCount >= 7) {
      window.setTimeout(
        () => endConversation("I have to leave it here. Please send a tighter version focused on our near-term project risk."),
        700
      );
    }
  }

  function endConversation(optionalFinalMessage) {
    if (state.step !== "chat") return;

    if (optionalFinalMessage) {
      addChatMessage("customer", optionalFinalMessage);
    }

    stopTimer();
    const review = MockAI.generateReview(state.history, state.context);
    renderReview(review);
    setStep("review");
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
    els.outcomeBadge.textContent = `Outcome: ${review.outcome}`;
    els.outcomeBadge.className = "outcome-badge";
    els.outcomeBadge.classList.add(`outcome-${review.outcome.toLowerCase()}`);

    renderList(els.goodPoints, review.goodPoints);
    renderList(els.unclearPoints, review.unclearPoints);
    renderList(els.riskPoints, review.riskPoints);

    els.missingType.textContent = `Missing knowledge type: ${review.coaching.missingKnowledgeType}`;
    els.knowledgeToAdd.textContent = review.coaching.keyKnowledgeToAdd;
    els.suggestedPhrase.textContent = review.coaching.suggestedPhrasing;
    els.nextAction.textContent = `Next action: ${review.coaching.nextAction}`;
  }

  function resetToHome() {
    stopTimer();
    state.context = null;
    state.history = [];
    state.turnCount = 0;
    state.startedAt = null;
    setStep("home");
  }

  function bindEvents() {
    document.getElementById("startBtn").addEventListener("click", () => setStep("setup"));
    document.getElementById("backHomeBtn").addEventListener("click", () => setStep("home"));
    document.getElementById("beginChatBtn").addEventListener("click", startConversation);
    document.getElementById("sendBtn").addEventListener("click", submitUserMessage);
    document.getElementById("chatInput").addEventListener("keydown", (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") submitUserMessage();
    });
    document.getElementById("endChatBtn").addEventListener("click", () => endConversation());

    document.getElementById("retryBtn").addEventListener("click", startConversation);
    document.getElementById("newRunBtn").addEventListener("click", resetToHome);
    els.restartTopBtn.addEventListener("click", resetToHome);
  }

  renderOptions();
  bindEvents();
})();
