const steps = [
  {
    title: "選擇市場",
    hint: "選擇你想要 Replay、Demo 或 Paper Trading 測試的市場。",
    key: "market"
  },
  {
    title: "選擇使用模式",
    hint: "決定 AI 只能讀取、可以在模擬環境操作，或是否允許進入 Live 規格。Live 必須保留人工確認。",
    key: "mode"
  },
  {
    title: "選擇交易人格",
    hint: "這會決定 AI 團隊偏向快進快出、日內交易或較長週期觀察。",
    key: "personality"
  },
  {
    title: "選擇目標",
    hint: "告訴 AI 團隊你最重視勝率、穩定、收益、回撤或進場速度。",
    key: "goal"
  },
  {
    title: "選擇風格",
    hint: "保守會降低交易頻率；進攻會提高機會，但也提高假訊號風險。",
    key: "style"
  },
  {
    title: "選擇重要參考指標",
    hint: "選擇 AI 需要參考的指標。它們只做輔助確認，不會單獨決定買賣。",
    key: "indicators"
  },
  {
    title: "設定盈利目標、止損與風控",
    hint: "設定每日盈利目標、單筆最大止損、每日最大虧損、最低盈虧比與最大口數。",
    key: "risk"
  },
  {
    title: "建立你的 AI Trading Team",
    hint: "用快速組合建立團隊，再微調核心與專家 Agent。Risk Manager 擁有否決權。",
    key: "agents"
  }
];

const options = {
  market: [
    ["MNQ", "微型 Nasdaq，適合日內 Replay 與短線測試。"],
    ["NQ", "波動較大，適合進階使用者。"],
    ["ES", "流動性高，節奏相對穩定。"],
    ["MES", "微型 S&P，適合低風險練習。"],
    ["XAUUSD", "黃金，受新聞與美元影響較大。"],
    ["BTC", "加密貨幣，波動高且全天候交易。"],
    ["ETH", "加密貨幣，適合測試波動與趨勢策略。"],
    ["Forex", "外匯市場，適合宏觀與趨勢觀察。"]
  ],
  mode: [
    ["Read-Only", "只允許觀察、分析、產生建議與 Prompt。不得點擊 Buy、Sell、Close、Exit 或修改訂單。適合研究、回顧與策略設計。"],
    ["Demo", "允許在 Demo、Replay 或 Paper Trading 環境中測試流程。任何下單或出場動作都必須先描述下一步，且不得假設真實帳戶授權。"],
    ["Live", "最高風險模式。只產生 Live-ready 規格，不代表直接授權自動交易；每次買賣、加碼、減倉、平倉都必須要求人工確認。"]
  ],
  personality: [
    ["Scalper", "快速判斷，訊號較多，噪音也較高。"],
    ["Day Trader", "日內完成，不留倉，適合多數短線交易者。"],
    ["Swing Trader", "較慢決策，重視較大週期方向。"],
    ["Position Trader", "低頻率，重視大方向與風險控制。"],
    ["Hybrid Trader", "混合短線與結構判斷，彈性較高。"]
  ],
  goal: [
    ["最高勝率", "偏向等待更強確認，降低交易頻率。"],
    ["穩定獲利", "平衡勝率、RR 與交易頻率。"],
    ["最大收益", "允許更大波動與較高風險。"],
    ["最小回撤", "優先保護本金與降低連續虧損。"],
    ["快速進場", "重視即時觸發，適合 Replay 測試。"]
  ],
  style: [
    ["保守", "等待更強確認，較少交易，風控更嚴。"],
    ["平衡", "確認與機會折中，適合作為預設模式。"],
    ["進攻", "更快提示，交易機會多，但風險較高。"]
  ]
};

const agents = [
  {
    id: "risk",
    icon: "🛡",
    name: "Risk Manager",
    shortName: "Risk Manager",
    role: "風控主管",
    duty: "擁有否決權，阻擋 RR 不足、過度交易與高風險環境。",
    why: "每個 AI 交易團隊都需要一位能說不的 Agent。",
    group: "core",
    selected: true,
    locked: true
  },
  {
    id: "oneMinute",
    icon: "⚡",
    name: "1m Trader",
    shortName: "1m Trader",
    role: "即時進場觀察員",
    duty: "觀察短線觸發、突破、回踩與假突破。",
    why: "適合需要精準進場與 Replay 測試的使用者。",
    group: "core",
    selected: true
  },
  {
    id: "fiveMinute",
    icon: "📈",
    name: "5m Trader",
    shortName: "5m Trader",
    role: "短線結構分析員",
    duty: "判斷 Higher High、Higher Low、Lower High、Lower Low。",
    why: "避免只看 1 分鐘訊號造成過度交易。",
    group: "core",
    selected: true
  },
  {
    id: "oneHour",
    icon: "🏛",
    name: "1h Trader",
    shortName: "Trend",
    role: "大方向分析員",
    duty: "判斷較高週期方向，避免明顯逆勢。",
    why: "讓短線交易不脫離大方向背景。",
    group: "core",
    selected: true
  },
  {
    id: "support",
    icon: "🎯",
    name: "Support Resistance",
    shortName: "Support",
    role: "關鍵位專家",
    duty: "檢查前高、前低、開盤區、流動性區與附近壓力。",
    why: "避免把交易開在支撐壓力正前方。",
    group: "specialist",
    selected: true
  },
  {
    id: "liquidity",
    icon: "💧",
    name: "Liquidity",
    shortName: "Liquidity",
    role: "流動性觀察員",
    duty: "提醒可能的掃流動性與假突破。",
    why: "適合反轉或突破失敗策略。",
    group: "specialist",
    selected: true
  },
  {
    id: "volume",
    icon: "📊",
    name: "Volume",
    shortName: "Volume",
    role: "成交量分析員",
    duty: "觀察突破是否放量、回踩是否縮量。",
    why: "提高突破與延續判斷品質。",
    group: "specialist",
    selected: true
  },
  {
    id: "news",
    icon: "📰",
    name: "News",
    shortName: "News",
    role: "新聞風險官",
    duty: "提醒 CPI、FOMC、NFP、央行談話等事件風險。",
    why: "避免在高衝擊新聞前後讓 AI 亂交易。",
    group: "specialist",
    selected: false
  },
  {
    id: "macro",
    icon: "🌎",
    name: "Macro",
    shortName: "Macro",
    role: "宏觀策略員",
    duty: "觀察大方向與市場背景。",
    why: "適合較長週期或跨市場交易者。",
    group: "specialist",
    selected: false
  }
];

const presets = [
  {
    id: "scalper",
    label: "Scalper",
    hint: "快速進出，保留核心團隊與關鍵位、流動性、成交量專家。",
    agentIds: ["risk", "oneMinute", "fiveMinute", "oneHour", "support", "liquidity", "volume"]
  },
  {
    id: "dayTrader",
    label: "Day Trader",
    hint: "日內交易配置，加入新聞風險檢查，適合 Replay / Demo。",
    agentIds: ["risk", "oneMinute", "fiveMinute", "oneHour", "support", "volume", "news"]
  },
  {
    id: "swing",
    label: "Swing",
    hint: "降低短線噪音，重視大方向、關鍵位、新聞與宏觀背景。",
    agentIds: ["risk", "fiveMinute", "oneHour", "support", "news", "macro"]
  },
  {
    id: "custom",
    label: "Custom",
    hint: "保留目前選擇，讓你手動調整團隊。",
    agentIds: null
  }
];

const indicators = [
  {
    id: "macd",
    name: "MACD",
    role: "動能轉折",
    hint: "用來觀察多空動能是否正在切換，適合搭配趨勢與回踩判斷。",
    selected: true
  },
  {
    id: "rsi",
    name: "RSI",
    role: "強弱與過熱",
    hint: "用來觀察市場是否過熱、過弱，避免追在太極端的位置。",
    selected: true
  },
  {
    id: "vwap",
    name: "VWAP",
    role: "日內均衡價",
    hint: "日內交易常用，用來判斷價格偏多、偏空或回到公平區。",
    selected: true
  },
  {
    id: "kdj",
    name: "KDJ",
    role: "短線轉折",
    hint: "用來輔助觀察短線反轉與鈍化，但需要搭配結構確認。",
    selected: false
  },
  {
    id: "ema",
    name: "EMA",
    role: "趨勢方向",
    hint: "用來判斷短中期方向與回踩位置，不應單獨當作進場理由。",
    selected: false
  },
  {
    id: "volume",
    name: "Volume",
    role: "成交量確認",
    hint: "用來觀察突破是否有量、回踩是否縮量。",
    selected: true
  },
  {
    id: "atr",
    name: "ATR",
    role: "波動與止損距離",
    hint: "用來判斷波動是否過大，以及止損與目標是否合理。",
    selected: false
  },
  {
    id: "supportResistance",
    name: "Support / Resistance",
    role: "關鍵價位",
    hint: "用來避免在壓力前追多，或在支撐前追空。",
    selected: true
  }
];

const state = {
  step: 0,
  market: null,
  mode: null,
  personality: null,
  goal: null,
  style: null,
  preset: "scalper",
  risk: {
    profitTarget: 300,
    stopLoss: 100,
    dailyLoss: 300,
    minimumRR: 1.5,
    maxContracts: 1,
    addOnRule: "不允許加碼"
  }
};

const $ = id => document.getElementById(id);

const validationMessages = {
  market: "請先選擇市場，再進入下一步。",
  mode: "請先選擇使用模式：Read-Only、Demo 或 Live。",
  personality: "請先選擇交易人格，再進入下一步。",
  goal: "請先選擇交易目標，再進入下一步。",
  style: "請先選擇交易風格，再進入指標選擇。",
  indicators: "請至少選擇 1 個參考指標，讓 Codex 能產生指標規格。",
  risk: "請確認風控設定：止損與每日最大虧損必須大於 0，最低盈虧比至少 0.5，最大口數必須是 1 以上的整數。",
  agents: "請至少選擇 3 位 Agent，並保留 Risk Manager。"
};

function init() {
  renderChoices("marketChoices", "market");
  renderChoices("modeChoices", "mode");
  renderChoices("personalityChoices", "personality");
  renderChoices("goalChoices", "goal");
  renderChoices("styleChoices", "style");
  renderIndicators();
  renderPresets();
  renderAgents();
  bindEvents();
  syncRiskInputs();
  updateWizard();
  updateSummary();
}

function renderChoices(containerId, key) {
  const container = $(containerId);
  container.innerHTML = options[key].map(([title, description]) => `
    <button class="choice" type="button" data-key="${key}" data-value="${title}" title="${description}">
      <strong>${title}</strong>
      <span>${description}</span>
    </button>
  `).join("");
}

function renderPresets() {
  $("presetChoices").innerHTML = presets.map(preset => `
    <button class="preset-chip ${state.preset === preset.id ? "selected" : ""}" type="button" data-preset="${preset.id}" title="${preset.hint}">
      ${preset.label}
    </button>
  `).join("");
}

function renderAgents() {
  $("coreAgentChoices").innerHTML = renderAgentGroup("core");
  $("specialistAgentChoices").innerHTML = renderAgentGroup("specialist");
  updateTeamPreview();
}

function renderAgentGroup(group) {
  return agents.filter(agent => agent.group === group).map(agent => `
    <button class="agent-card ${agent.selected ? "selected" : ""}" type="button" data-agent="${agent.id}" title="${agent.why}" ${agent.locked ? "aria-disabled=\"true\"" : ""}>
      <strong><span>${agent.icon}</span>${agent.name}</strong>
      <span>${agent.role}</span>
      <span>${agent.duty}</span>
      <small>${agent.locked ? "必選" : agent.selected ? "已加入" : "可加入"} · ${agent.why}</small>
    </button>
  `).join("");
}

function bindEvents() {
  document.querySelectorAll(".choice").forEach(button => {
    button.addEventListener("click", () => {
      state[button.dataset.key] = button.dataset.value;
      markDirty();
      updateSelectedChoices();
      updateSummary();
      if (state.step < 5) {
        goToStep(state.step + 1);
      }
    });
  });

  $("indicatorChoices").addEventListener("click", event => {
    const card = event.target.closest(".indicator-card");
    if (!card) return;
    const indicator = indicators.find(item => item.id === card.dataset.indicator);
    if (!indicator) return;
    indicator.selected = !indicator.selected;
    markDirty();
    renderIndicators();
    updateSummary();
  });

  $("presetChoices").addEventListener("click", event => {
    const button = event.target.closest(".preset-chip");
    if (!button) return;
    applyPreset(button.dataset.preset);
  });

  $("agents").addEventListener("click", event => {
    const card = event.target.closest(".agent-card");
    if (!card) return;
    const agent = agents.find(item => item.id === card.dataset.agent);
    if (!agent || agent.locked) return;
    agent.selected = !agent.selected;
    state.preset = "custom";
    markDirty();
    renderPresets();
    renderAgents();
    updateSummary();
  });

  [
    ["profitTargetInput", "profitTarget", toRiskNumber],
    ["stopLossInput", "stopLoss", toRiskNumber],
    ["dailyLossInput", "dailyLoss", toRiskNumber],
    ["minimumRRInput", "minimumRR", toRiskNumber],
    ["maxContractsInput", "maxContracts", toRiskNumber],
    ["addOnRuleInput", "addOnRule", value => value]
  ].forEach(([id, key, normalize]) => {
    $(id).addEventListener("input", event => {
      state.risk[key] = normalize(event.target.value);
      markDirty();
      markRiskValidity();
      updateSummary();
    });
    $(id).addEventListener("change", event => {
      state.risk[key] = normalize(event.target.value);
      markDirty();
      markRiskValidity();
      updateSummary();
    });
  });

  $("backBtn").addEventListener("click", () => goToStep(state.step - 1));
  $("nextBtn").addEventListener("click", () => {
    if (!validateStep(state.step)) return;
    if (state.step < steps.length - 1) {
      goToStep(state.step + 1);
      return;
    }
    showResults();
  });

  $("togglePromptBtn").addEventListener("click", () => {
    $("promptPanel").classList.toggle("is-collapsed");
    $("togglePromptBtn").textContent = $("promptPanel").classList.contains("is-collapsed")
      ? "展開 Prompt"
      : "收合 Prompt";
  });

  $("copyPromptBtn").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText($("promptOutput").value);
      flashButton($("copyPromptBtn"), "已複製");
    } catch (error) {
      $("promptPanel").classList.remove("is-collapsed");
      $("promptOutput").focus();
      $("promptOutput").select();
      flashButton($("copyPromptBtn"), "請手動複製");
    }
  });

  $("downloadPromptBtn").addEventListener("click", () => {
    const blob = new Blob([$("promptOutput").value], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ai-trading-starter-prompt.md";
    link.click();
    URL.revokeObjectURL(url);
  });
}

function renderIndicators() {
  $("indicatorChoices").innerHTML = indicators.map(indicator => `
    <button class="indicator-card ${indicator.selected ? "selected" : ""}" type="button" data-indicator="${indicator.id}" title="${indicator.hint}">
      <strong>${indicator.name}</strong>
      <span>${indicator.role}</span>
      <small>${indicator.selected ? "已加入" : "可加入"} · ${indicator.hint}</small>
    </button>
  `).join("");
  updateIndicatorCount();
}

function applyPreset(presetId) {
  const preset = presets.find(item => item.id === presetId);
  if (!preset) return;
  state.preset = presetId;
  markDirty();
  if (preset.agentIds) {
    agents.forEach(agent => {
      agent.selected = agent.locked || preset.agentIds.includes(agent.id);
    });
  }
  renderPresets();
  renderAgents();
  updateSummary();
}

function goToStep(nextStep) {
  state.step = Math.max(0, Math.min(steps.length - 1, nextStep));
  updateWizard();
}

function markDirty() {
  if (!$("results").classList.contains("is-hidden")) {
    $("results").classList.add("is-hidden");
    $("readiness").textContent = "設定已更新，請重新產生 Prompt。";
  }
}

function toRiskNumber(value) {
  return value === "" ? NaN : Number(value);
}

function validateStep(stepIndex) {
  const key = steps[stepIndex].key;
  const validByKey = {
    market: Boolean(state.market),
    mode: Boolean(state.mode),
    personality: Boolean(state.personality),
    goal: Boolean(state.goal),
    style: Boolean(state.style),
    indicators: selectedIndicators().length >= 1,
    risk: hasValidRiskSettings(),
    agents: selectedAgents().length >= 3 && agents.find(agent => agent.id === "risk")?.selected
  };
  const isValid = Boolean(validByKey[key]);
  if (!isValid) {
    if (key === "risk") markRiskValidity();
    $("readiness").textContent = validationMessages[key] || "請先完成目前步驟。";
  }
  return isValid;
}

function updateWizard() {
  const step = steps[state.step];
  $("stepBadge").textContent = `Step ${state.step + 1} / ${steps.length}`;
  $("stepTitle").textContent = step.title;
  $("stepHint").textContent = step.hint;
  $("progressBar").style.width = `${((state.step + 1) / steps.length) * 100}%`;
  document.querySelectorAll(".step-panel").forEach(panel => {
    panel.classList.toggle("active", Number(panel.dataset.step) === state.step);
  });
  $("backBtn").disabled = state.step === 0;
  $("nextBtn").textContent = state.step === steps.length - 1 ? "產生 Prompt" : "下一步";
  if (steps[state.step].key === "risk") markRiskValidity();
}

function syncRiskInputs() {
  $("profitTargetInput").value = state.risk.profitTarget;
  $("stopLossInput").value = state.risk.stopLoss;
  $("dailyLossInput").value = state.risk.dailyLoss;
  $("minimumRRInput").value = state.risk.minimumRR;
  $("maxContractsInput").value = state.risk.maxContracts;
  $("addOnRuleInput").value = state.risk.addOnRule;
  markRiskValidity();
}

function markRiskValidity() {
  const fieldChecks = [
    ["profitTargetInput", Number(state.risk.profitTarget) >= 0],
    ["stopLossInput", Number(state.risk.stopLoss) > 0],
    ["dailyLossInput", Number(state.risk.dailyLoss) > 0],
    ["minimumRRInput", Number(state.risk.minimumRR) >= 0.5],
    ["maxContractsInput", Number(state.risk.maxContracts) >= 1 && Number.isInteger(Number(state.risk.maxContracts))]
  ];
  fieldChecks.forEach(([id, isValid]) => {
    const field = $(id).closest(".risk-field");
    field.classList.toggle("invalid", !isValid);
  });
}

function updateSelectedChoices() {
  document.querySelectorAll(".choice").forEach(button => {
    button.classList.toggle("selected", state[button.dataset.key] === button.dataset.value);
  });
}

function updateSummary() {
  $("summaryMarket").textContent = state.market || "尚未選擇";
  $("summaryMode").textContent = state.mode || "尚未選擇";
  $("summaryPersonality").textContent = state.personality || "尚未選擇";
  $("summaryGoal").textContent = state.goal || "尚未選擇";
  $("summaryStyle").textContent = state.style || "尚未選擇";
  $("summaryIndicators").textContent = selectedIndicators().length
    ? selectedIndicators().map(indicator => indicator.name).join(" / ")
    : "尚未選擇";
  $("summaryProfitTarget").textContent = formatMoneyLike(state.risk.profitTarget);
  $("summaryStopLoss").textContent = formatMoneyLike(state.risk.stopLoss);
  $("summaryDailyRisk").textContent = `${formatMoneyLike(state.risk.dailyLoss)} / RR ${formatRiskNumber(state.risk.minimumRR)}`;
  $("summaryAgents").textContent = `${selectedAgents().length} 位已選`;
  $("readiness").textContent = isReady()
    ? "已完成 Starter。可以產生 AI Trading Prompt。"
    : "完成 8 個步驟後，會顯示策略預覽與 Prompt。";
}

function updateIndicatorCount() {
  $("indicatorCount").textContent = `${selectedIndicators().length} 個已選`;
}

function updateAgentCount() {
  $("agentCount").textContent = `${selectedAgents().length} 位已選`;
}

function updateTeamPreview() {
  const core = selectedAgents().filter(agent => agent.group === "core").length;
  const specialists = selectedAgents().filter(agent => agent.group === "specialist").length;
  const tokenEstimate = 1800 + selectedAgents().length * 200;
  const qualityScore = Math.min(5, Math.max(2, Math.round((core * 0.7) + (specialists * 0.45))));
  $("coreCount").textContent = core;
  $("specialistCount").textContent = specialists;
  $("tokenEstimate").textContent = `${tokenEstimate} Tokens`;
  $("qualityEstimate").textContent = `${"★".repeat(qualityScore)}${"☆".repeat(5 - qualityScore)}`;
  $("teamDebatePreview").innerHTML = buildTeamDebatePreview().map(item => `
    <div>
      <span>${item.agent}</span>
      <strong class="${item.tone}">${item.vote}</strong>
    </div>
  `).join("");
  $("teamFinalVote").textContent = specialists >= 2 && core >= 4 ? "LONG Approved" : "WAIT";
  updateAgentCount();
}

function buildTeamDebatePreview() {
  const selectedIds = new Set(selectedAgents().map(agent => agent.id));
  const items = [
    { agent: "1m Trader", vote: selectedIds.has("oneMinute") ? "Buy" : "Wait", tone: "agree" },
    { agent: "Risk Manager", vote: "Reject", tone: "reject" },
    { agent: "Volume", vote: selectedIds.has("volume") ? "Agree" : "No Data", tone: selectedIds.has("volume") ? "agree" : "neutral" },
    { agent: "Trend", vote: selectedIds.has("oneHour") ? "Agree" : "No Bias", tone: selectedIds.has("oneHour") ? "agree" : "neutral" }
  ];
  return items;
}

function selectedAgents() {
  return agents.filter(agent => agent.selected);
}

function selectedIndicators() {
  return indicators.filter(indicator => indicator.selected);
}

function isReady() {
  return Boolean(
    state.market &&
    state.mode &&
    state.personality &&
    state.goal &&
    state.style &&
    selectedIndicators().length >= 1 &&
    hasValidRiskSettings() &&
    selectedAgents().length >= 3
  );
}

function hasValidRiskSettings() {
  return (
    Number.isFinite(Number(state.risk.profitTarget)) &&
    Number.isFinite(Number(state.risk.stopLoss)) &&
    Number.isFinite(Number(state.risk.dailyLoss)) &&
    Number.isFinite(Number(state.risk.minimumRR)) &&
    Number.isFinite(Number(state.risk.maxContracts)) &&
    Number(state.risk.profitTarget) >= 0 &&
    Number(state.risk.stopLoss) > 0 &&
    Number(state.risk.dailyLoss) > 0 &&
    Number(state.risk.minimumRR) >= 0.5 &&
    Number(state.risk.maxContracts) >= 1 &&
    Number.isInteger(Number(state.risk.maxContracts))
  );
}

function formatMoneyLike(value) {
  return Number.isFinite(Number(value)) ? `${Number(value).toLocaleString()}` : "未設定";
}

function formatRiskNumber(value) {
  return Number.isFinite(Number(value)) ? Number(value).toLocaleString() : "未設定";
}

function showResults() {
  if (!isReady()) {
    $("readiness").textContent = "請先完成市場、使用模式、人格、目標、風格、參考指標、風控設定，並至少選擇 3 位 Agent。";
    return;
  }
  renderResults();
  $("results").classList.remove("is-hidden");
  $("results").scrollIntoView?.({ behavior: "smooth", block: "start" });
}

function renderResults() {
  const summary = [
    ["市場", state.market],
    ["使用模式", state.mode],
    ["交易人格", state.personality],
    ["目標", state.goal],
    ["風格", state.style],
    ["參考指標", selectedIndicators().map(indicator => indicator.name).join(" / ")],
    ["每日盈利目標", formatMoneyLike(state.risk.profitTarget)],
    ["單筆最大止損", formatMoneyLike(state.risk.stopLoss)],
    ["每日最大虧損", formatMoneyLike(state.risk.dailyLoss)],
    ["最低盈虧比", state.risk.minimumRR],
    ["最大口數", state.risk.maxContracts],
    ["加碼規則", state.risk.addOnRule],
    ["快速組合", presets.find(preset => preset.id === state.preset)?.label || "Custom"],
    ["執行範圍", modeExecutionScope()],
    ["安全設定", "不把任何訊號視為 Real / Live 自動交易授權"]
  ];
  $("strategySummary").innerHTML = summary.map(([label, value]) => `
    <div class="summary-item"><strong>${label}</strong><br>${value}</div>
  `).join("");

  $("selectedAgents").innerHTML = selectedAgents().map(agent => `
    <div class="selected-agent">
      <strong>${agent.name} · ${agent.role}</strong>
      ${agent.duty}
    </div>
  `).join("");

  $("debateFlow").innerHTML = buildDebateItems().map(item => `
    <div class="debate-item">
      <strong>${item.title}</strong>
      ${item.text}
    </div>
  `).join("");

  $("promptOutput").value = buildPrompt();
}

function buildDebateItems() {
  return [
    { title: "1m Trader", text: "提出可能的短線進場條件，但不能直接下單。" },
    { title: "Risk Manager", text: "檢查 RR、日內風險、最大虧損與是否過度交易；必要時否決。" },
    { title: "Support Resistance", text: "檢查上方/下方是否有太近的壓力或支撐。" },
    { title: "Trend", text: "確認大方向是否支持目前想法，避免明顯逆勢。" },
    { title: "最終共識", text: "只有 Decision Engine 可以輸出買進、賣出、等待、出場。" }
  ];
}

function buildPrompt() {
  const agentText = selectedAgents().map(agent => `- ${agent.name}（${agent.role}）：${agent.duty}`).join("\n");
  const indicatorText = selectedIndicators().map(indicator => `- ${indicator.name}（${indicator.role}）：${indicator.hint}`).join("\n");
  const modeRules = buildModeRules();
  const executionPolicy = buildExecutionPolicy();
  return `# AI Trading Prompt Starter

你是我的 AI Trading Team Coordinator 與交易指標規格設計師。請用保守、清楚、風控優先的方式，根據以下選項產生可交給 Codex 實作的自動交易提示詞、指標規格與測試計畫。

## 使用者設定
- 市場：${state.market}
- 使用模式：${state.mode}
- 交易人格：${state.personality}
- 目標：${state.goal}
- 風格：${state.style}
- 參考指標：${selectedIndicators().map(indicator => indicator.name).join(" / ")}
- 每日盈利目標：${formatMoneyLike(state.risk.profitTarget)}
- 單筆最大止損：${formatMoneyLike(state.risk.stopLoss)}
- 每日最大虧損：${formatMoneyLike(state.risk.dailyLoss)}
- 最低盈虧比：${state.risk.minimumRR}
- 最大口數：${state.risk.maxContracts}
- 加碼規則：${state.risk.addOnRule}
- 快速組合：${presets.find(preset => preset.id === state.preset)?.label || "Custom"}
- 執行範圍：${modeExecutionScope()}

## 使用模式規則
${modeRules}

## 安全判斷分層
請把資訊不足分成「硬阻擋」與「軟降分」，避免因輔助資訊缺少而永遠無法測試。

硬阻擋條件：
1. 畫面顯示 Real / Live / 真實帳戶，但使用模式不是 Live。
2. 使用模式是 Read-Only，卻需要點擊 Buy / Sell / Close / Exit / Cancel / Replace。
3. 商品不是使用者設定市場，或無法確認目前交易商品。
4. qty 超過最大口數 ${state.risk.maxContracts}，或 qty 不可見且準備下單。
5. 實際持倉不明，且無法確認 Position / Orders / Working Orders。
6. entry、stop、take profit、失效條件無法形成完整候選 setup。
7. 候選 setup 的 RR < ${state.risk.minimumRR}，或單筆止損超過 ${formatMoneyLike(state.risk.stopLoss)}。

軟降分條件：
1. MACD / RSI / VWAP / KDJ / Volume / News / Macro 不可見。
2. 5m / 1h 結構不可見，但 1m 價格結構、關鍵價位與風控仍清楚。
3. daily PnL 不可見，但使用模式是 Demo / Replay / Paper 且沒有其他硬阻擋。
4. 畫面只有部分輔助指標，或指標互相衝突。

軟降分處理：
1. 不可假造不可見資料。
2. 必須在風險段落標註不可見資訊。
3. 降低 confidence 或 setup_score。
4. 但不得只因輔助指標不可見就直接阻擋 Demo / Replay / Paper 測試。

## 部位與帳戶判讀優先順序
1. 實際部位以交易面板 Position、Orders/Positions 面板的 open position、avg price、working orders 為主。
2. Market Analyzer 或商品列表中的數字不得單獨視為持倉。
3. 若商品列表顯示數字但交易面板 Position = 0，請標註「可能是列表/報價欄位，不等於持倉」，不得因此直接判定已有部位。
4. 若 Position 與 Orders/Positions 面板衝突，才視為硬阻擋並要求人工確認。

## 每輪必須產生候選 Setup
即使最終建議是等待，也必須嘗試整理一組或多組候選 setup：
1. direction：買進 / 賣出 / 等待。
2. entry：候選進場價或觸發條件。
3. stop：候選止損位置。
4. take_profit：候選盈利目標。
5. invalidation：失效條件。
6. rr：用候選 entry、stop、take_profit 計算 RR。
7. setup_score 與 confidence：說明加分與扣分來源。

如果候選 setup 無法達到最低 RR 或風控門檻，請說明「候選不合格」；不要只輸出 RR 不可計算。

## Demo / Replay 執行政策
${executionPolicy}

## AI Agent 團隊
${agentText}

## 參考指標
${indicatorText}

## 請產生的內容
1. Codex-ready 自動交易 Prompt：包含角色、限制、流程、輸出格式與安全規則。
2. 指標規格：說明畫面要如何顯示 AI 建議買進、AI 建議賣出、觀察中、等待確認、風險過高與不建議交易。
3. 訊號邏輯：描述什麼情況可以提出 Buy / Sell / Watch，但 Agent 不可直接下單。
4. 風控與出場規格：包含止損、盈利目標、最低盈虧比、最大口數與加碼規則。
5. 測試計畫：優先使用 Replay / Demo / Paper Trading，驗證 Prompt 與指標是否一致。

## 指標顯示需求
1. 指標應該用新手看得懂的文字顯示，不要一開始要求使用者理解複雜技術名詞。
2. 圖上可顯示：AI 建議買進、AI 建議賣出、觀察中、等待確認、風險過高、不建議交易。
3. 若有正式訊號，必須同時顯示進場理由、止損位置、盈利目標、最低盈虧比與風險提醒。
4. 若條件不足，應優先顯示等待或觀察，不要過度產生訊號。
5. 指標只做決策輔助，不代表真實帳戶自動下單授權。
6. 參考指標只能作為證據來源。不得因 MACD、RSI、VWAP、KDJ 或任何單一指標出現訊號，就直接輸出買進或賣出。
7. 若多個指標互相衝突，請降低信心並要求 Agent Debate 說明分歧。

## Agent 工作規則
1. Agent 只能提供觀察、支持理由、反對理由、最大風險、關鍵價位與失效條件。
2. Agent 不允許直接輸出「立刻買進」或「立刻賣出」。
3. Risk Manager 擁有否決權。若硬阻擋條件成立、RR 不足、風險過高、接近重大新聞或核心安全資訊不清楚，必須阻擋交易。
4. 至少三位 Agent 必須提出反方觀點或風險提醒，避免所有 Agent 無條件同意。
5. 只有 Decision Engine 可以輸出最終狀態：買進、賣出、等待、持有、減倉、出場。

## 風控規則
1. 若單筆預估止損超過 ${formatMoneyLike(state.risk.stopLoss)}，Risk Manager 必須阻擋。
2. 若當日虧損接近或達到 ${formatMoneyLike(state.risk.dailyLoss)}，停止尋找新交易。
3. 若當日盈利達到 ${formatMoneyLike(state.risk.profitTarget)}，停止主動開新倉，優先回顧與保護獲利。
4. 任何交易的最低盈虧比必須 >= ${state.risk.minimumRR}。
5. 最大口數不得超過 ${state.risk.maxContracts}。
6. 加碼規則：${state.risk.addOnRule}。

## AI 操控電腦規則
1. 每次準備操作畫面前，先用一句話通知目前觀察與下一步。
2. 若帳戶模式、商品、qty、Buy/Sell/Close/Exit 按鈕不可見，停止操作並要求人工確認。
3. 若看到 Real / Live / 真實帳戶，立即停止，不點擊任何交易按鈕。
4. 每輪最多一個動作。成交狀態不明時，不重複點擊。
5. 若 Agent 衝突、風險過高、接近重大新聞或交易理由不足，請輸出「等待」。
6. 必須遵守使用模式規則；若平台畫面與所選模式不一致，立即停止並要求人工確認。

## 輸出格式
- 狀態：安全 / 等待 / 需要確認 / 阻擋
- 市場觀察：簡短描述目前行情
- Agent 分歧：列出支持與反對
- 候選 Setup：direction、entry、stop、take_profit、RR、setup_score、confidence、失效條件
- 風險：硬阻擋、軟降分、關鍵位、新聞或資訊不明
- 最終建議：買進 / 賣出 / 等待 / 出場
- 下一步：繼續觀察、要求確認或只管理既有部位

請保持語氣溫和、具體、可執行，不要誇大勝率，也不要把任何建議當成真實帳戶自動交易授權。`;
}

function modeExecutionScope() {
  if (state.mode === "Read-Only") return "只讀分析；不得操作交易按鈕或修改訂單。";
  if (state.mode === "Demo") return "Demo / Replay / Paper Trading 測試；不得視為真實帳戶授權。";
  if (state.mode === "Live") return "Live-ready 規格；所有實際交易動作都必須人工確認。";
  return "尚未設定";
}

function buildModeRules() {
  if (state.mode === "Read-Only") {
    return `1. 只能讀取畫面、整理觀察、產生 Prompt、指標規格與測試建議。
2. 禁止點擊 Buy、Sell、Close、Exit、Cancel、Replace 或任何會改變訂單/部位的按鈕。
3. 禁止修改 qty、價格、停損、止盈或帳戶設定。
4. 適合策略研究、回顧、Replay 分析與開發前規格整理。`;
  }
  if (state.mode === "Demo") {
    return `1. 只允許在 Demo、Replay 或 Paper Trading 環境中測試。
2. 每次操作前必須先說明觀察、理由、風險與下一步。
3. 若畫面顯示 Real、Live、真實帳戶或帳戶模式不明，立即停止。
4. 可用於驗證 Prompt、指標顯示、風控流程與 Agent Debate 是否一致。`;
  }
  if (state.mode === "Live") {
    return `1. Live 是最高風險模式；此 Prompt 只產生 Live-ready 規格，不構成自動交易授權。
2. 每一次買進、賣出、加碼、減倉、平倉、取消或修改訂單，都必須要求人工確認。
3. 若無法清楚辨識帳戶、商品、口數、部位、PnL、停損與止盈，立即停止。
4. Risk Manager 擁有最高否決權；任何風控、新聞、衝突或資訊不明，都必須輸出等待。`;
  }
  return "1. 尚未選擇使用模式。";
}

function buildExecutionPolicy() {
  if (state.mode === "Read-Only") {
    return `1. execution_allowed 永遠為 false。
2. 可以產生候選 setup、RR、風險與觀察建議。
3. 不得點擊任何交易、訂單或部位管理按鈕。`;
  }
  if (state.mode === "Demo") {
    return `1. 若畫面明確是 Demo / Replay / Paper，且沒有硬阻擋，允許進入 Demo 測試判斷。
2. daily PnL 不可見時，不要直接阻擋候選 setup；請標註 daily PnL 不可見，並把 confidence 降低。
3. 若 daily PnL 不可見但其他核心安全條件完整，可以在 Demo / Replay / Paper 中用「daily PnL 未知，按 0 暫估」產生候選；實際點擊前仍需確認沒有達到日損/日利限制。
4. 輔助指標不可見只降分，不是硬阻擋。
5. 只有當候選 setup_score >= 72、confidence >= 68、RR >= ${state.risk.minimumRR}、stop <= ${formatMoneyLike(state.risk.stopLoss)}、qty <= ${state.risk.maxContracts}、position = 0、無 working orders，才允許 Demo/Paper 下單。
6. 若 position = 0 且商品列表出現數字，不得單獨視為持倉；請依部位判讀優先順序確認。`;
  }
  if (state.mode === "Live") {
    return `1. Live 模式不允許自動點擊交易按鈕；只產生 Live-ready 交易規格。
2. 每個候選 setup 都必須列出 entry、stop、take_profit、RR、最大虧損、失效條件與人工確認文字。
3. daily PnL、position、orders、qty、account mode 任一不清楚，必須阻擋。
4. 即使 setup 合格，也只能輸出「需要人工確認」，不得自行執行。`;
  }
  return "1. 尚未選擇使用模式，execution_allowed=false。";
}

function flashButton(button, text) {
  const original = button.textContent;
  button.textContent = text;
  setTimeout(() => {
    button.textContent = original;
  }, 1200);
}

init();
