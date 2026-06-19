const steps = [
  {
    title: "選擇市場",
    hint: "選擇你想先練習或模擬測試的市場。",
    key: "market"
  },
  {
    title: "選擇使用模式",
    hint: "先選你要讓系統做到哪一步：只觀察、模擬執行，或只提供真實帳戶建議。",
    key: "mode"
  },
  {
    title: "選擇交易人格",
    hint: "這會決定角色團隊偏向快進快出、日內交易或較長週期觀察。",
    key: "personality"
  },
  {
    title: "設定目標與風格",
    hint: "選擇你最重視的交易目標，以及偏保守、平衡或進攻的執行風格。",
    key: "goalStyle"
  },
  {
    title: "選擇重要參考指標",
    hint: "選擇需要參考的指標。它們只做輔助確認，不會單獨決定買賣。",
    key: "indicators"
  },
  {
    title: "設定盈利目標、止損與風控",
    hint: "設定每日盈利目標、單筆最大止損、每日最大虧損、最低盈虧比與最大口數。",
    key: "risk"
  },
  {
    title: "建立你的交易角色團隊",
    hint: "像挑選團隊成員一樣，把需要的角色加入你的交易桌。風控主管固定在場。",
    key: "agents"
  }
];

const options = {
  market: [
    ["MNQ", "微型 Nasdaq，適合日內回放與短線測試。"],
    ["NQ", "波動較大，適合進階使用者。"],
    ["ES", "流動性高，節奏相對穩定。"],
    ["MES", "微型 S&P，適合低風險練習。"],
    ["XAUUSD", "黃金，受新聞與美元影響較大。"],
    ["BTC", "加密貨幣，波動高且全天候交易。"],
    ["ETH", "加密貨幣，適合測試波動與趨勢策略。"],
    ["Forex", "外匯市場，適合宏觀與趨勢觀察。"]
  ],
  mode: [
    ["Replay Auto", "用歷史回放或模擬畫面練習；安全、授權、風控都通過後，系統才可執行。"],
    ["Paper Auto", "用紙上交易資金測試；適合正式使用前，把規則與節奏跑順。"],
    ["Demo Auto", "使用券商模擬帳戶；確認不是正式帳戶後，才依規則執行。"],
    ["Live View", "真實帳戶只觀察與分析，不點擊任何交易按鈕。"],
    ["Live Approve", "真實帳戶只提出建議；每個動作都必須等你確認。"],
    ["Live Auto", "最高風險。只有你明確授權並確認風險後，才允許自動執行。"]
  ],
  verbosity: [
    ["Compact", "只保留最短行動卡，適合穩定運行。"],
    ["Normal", "多一點原因說明，但不展開長篇討論。"],
    ["Review", "需要檢查設定時，才展開各角色意見。"]
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
    ["穩定獲利", "平衡勝率、盈虧比與交易頻率。"],
    ["最大收益", "允許更大波動與較高風險。"],
    ["最小回撤", "優先保護本金與降低連續虧損。"],
    ["快速進場", "重視即時觸發，適合回放測試。"]
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
    icon: "",
    name: "Risk Manager",
    displayName: "風控主管",
    shortName: "風控",
    role: "風控主管",
    duty: "擁有否決權，阻擋盈虧比不足、過度交易與高風險環境。",
    why: "每個交易角色團隊都需要一位能說不的風控主管。",
    promptSummary: "檢查使用者風控設定、止損、止盈、盈虧比、日損、口數與是否需要等待、減倉、平倉或人工確認。",
    prompt: `Role: 你是 Risk Manager Agent，負責套用使用者最新 risk 設定與風控規則。
Scope: 你只負責檢查每日盈利目標、單筆最大止損、每日最大虧損、最低 RR、最大口數、加碼規則、SL、TP、總失效條件與是否過度交易。
Must Not Do: 不可以因為 setup 很漂亮就放寬風控；不可以覆蓋 platform-safety；不可以自己決定最終下單。
Output:
Risk Status: pass / fail / unclear
New Entry Permission: allow / block
Position Action: none / WAIT / 減倉 / 平倉 / MANUAL
Reason: 簡短原因
Strict Rule: 使用者在 Starter UI 設定的 risk 數值優先於 skill 預設；但使用者設定不能覆蓋安全規則。`,
    group: "core",
    selected: true,
    locked: true
  },
  {
    id: "oneMinute",
    icon: "",
    name: "1m Trader",
    displayName: "即時交易員",
    shortName: "即時",
    role: "即時進場觀察員",
    duty: "觀察短線觸發、突破、回踩與假突破。",
    why: "適合需要精準進場與回放測試的使用者。",
    promptSummary: "只看一分鐘短線觸發、突破、回踩與假突破，不授權下單。",
    prompt: `Role: 你是 1m Trader Agent，負責觀察 1 分鐘短線觸發。
Scope: 你只負責判斷短線突破、回踩、假突破、K 線節奏與是否需要等待下一根確認。
Must Not Do: 不可以決定最終下單；不可以忽略 5m / 1h 結構；不可以越過 Risk Manager。
Output:
1m Trigger: long / short / wait / unclear
Trigger Quality: strong / acceptable / weak
Reason: 簡短原因
Strict Rule: 你只提供短線觸發品質，不提供最終交易授權。`,
    group: "core",
    selected: true
  },
  {
    id: "fiveMinute",
    icon: "",
    name: "5m Trader",
    displayName: "短線結構員",
    shortName: "短線",
    role: "短線結構分析員",
    duty: "判斷高點、低點、趨勢延續與結構破壞。",
    why: "避免只看 1 分鐘訊號造成過度交易。",
    promptSummary: "檢查五分鐘結構是否支持一分鐘觸發，避免短線噪音。",
    prompt: `Role: 你是 5m Trader Agent，負責判斷短線結構。
Scope: 你只負責 Higher High、Higher Low、Lower High、Lower Low、區間、趨勢延續與結構破壞。
Must Not Do: 不可以決定最終下單；不可以只因 1m 觸發就放行；不可以忽略 Risk Manager。
Output:
5m Structure: bullish / bearish / range / unclear
Structure Alignment: aligned / conflict / unclear
Reason: 簡短原因
Strict Rule: 你只負責結構品質，不是最終方向判斷者。`,
    group: "core",
    selected: true
  },
  {
    id: "oneHour",
    icon: "",
    name: "1h Trader",
    displayName: "大方向觀察員",
    shortName: "方向",
    role: "大方向分析員",
    duty: "判斷較高週期方向，避免明顯逆勢。",
    why: "讓短線交易不脫離大方向背景。",
    promptSummary: "檢查高週期方向是否與短線交易衝突。",
    prompt: `Role: 你是 1h Trend Agent，負責觀察較高週期方向。
Scope: 你只負責高週期趨勢、主要方向、明顯逆勢風險與是否應降低交易頻率。
Must Not Do: 不可以要求短線交易一定服從 1h；不可以決定最終下單；不可以捏造不可見資料。
Output:
Higher Timeframe Bias: bullish / bearish / neutral / unclear
Conflict With Setup: yes / no / unclear
Suggested Posture: normal / reduce_size / avoid_trade
Reason: 簡短原因
Strict Rule: 你只提供高週期背景與衝突提醒。`,
    group: "core",
    selected: true
  },
  {
    id: "support",
    icon: "",
    name: "Support Resistance",
    displayName: "關鍵位專家",
    shortName: "關鍵位",
    role: "關鍵位專家",
    duty: "檢查前高、前低、開盤區、流動性區與附近壓力。",
    why: "避免把交易開在支撐壓力正前方。",
    promptSummary: "判斷進場點是否太靠近反向支撐、壓力或流動性區。",
    prompt: `Role: 你是 Support Resistance Agent，負責判斷價格是否接近重要支撐、壓力或流動性區。
Scope: 你只負責判斷前高、前低、開盤區、當日高低、近期區間上下緣、明顯支撐、明顯壓力、流動性聚集區，以及進場點是否太靠近反向關鍵位。
You Should Look For: Nearby support, nearby resistance, prior high / prior low, session open area, break and retest level, liquidity zone, risk of entering directly into resistance or support.
Must Not Do: 不可以決定最終下單；不可以單靠支撐壓力要求進場；不可以忽略 Risk Manager；不可以忽略使用者設定的交易方向；不可以使用未被使用者選擇的指標。
Output:
Key Level Status: clear / unclear / not_visible
Nearest Support: value or not_visible
Nearest Resistance: value or not_visible
Entry Location: good / acceptable / poor
Warning: none / too_close_to_support / too_close_to_resistance / fake_breakout_risk
Reason: 簡短原因
Strict Rule: 你只負責關鍵位品質。如果進場點正前方就是反向關鍵位，必須警告。`,
    group: "specialist",
    selected: true
  },
  {
    id: "liquidity",
    icon: "",
    name: "Liquidity",
    displayName: "流動性觀察員",
    shortName: "流動性",
    role: "流動性觀察員",
    duty: "提醒可能的掃流動性與假突破。",
    why: "適合反轉或突破失敗策略。",
    promptSummary: "觀察掃流動性、假突破、突破失敗與追價風險。",
    prompt: `Role: 你是 Liquidity Agent，負責觀察掃流動性、假突破與突破失敗風險。
Scope: 你只負責判斷是否剛掃過前高、是否剛掃過前低、是否是假突破、是否突破後無法延續、是否有流動性陷阱、是否適合等待確認而不是立刻追價。
You Should Look For: Stop hunt, liquidity sweep, failed breakout, failed breakdown, reclaim after sweep, rejection after sweep, trap risk.
Must Not Do: 不可以決定最終下單；不可以把所有突破都當作假突破；不可以把所有掃流動性都當作反轉；不可以忽略 5m / 1h 結構；不可以忽略 Risk Manager；不可以使用未被使用者選擇的指標。
Output:
Liquidity Event: sweep_high / sweep_low / failed_breakout / failed_breakdown / none / unclear
Trap Risk: low / medium / high
Suggested Action: wait_confirmation / allow_trade / avoid_chase / unclear
Reason: 簡短原因
Strict Rule: 你只負責流動性與假突破風險。你不是最終方向判斷者。`,
    group: "specialist",
    selected: true
  },
  {
    id: "volume",
    icon: "",
    name: "Volume",
    displayName: "成交量分析員",
    shortName: "成交量",
    role: "成交量分析員",
    duty: "觀察突破是否放量、回踩是否縮量。",
    why: "提高突破與延續判斷品質。",
    promptSummary: "確認成交量是否支持突破、回踩、延續或反轉。",
    prompt: `Role: 你是 Volume Agent，負責觀察成交量是否支持突破、延續、回踩或反轉。
Scope: 你只負責判斷突破是否放量、回踩是否縮量、反轉是否有成交量支持、成交量是否不足、當前動能是否可能延續。
You Should Look For: High volume breakout, low volume pullback, volume divergence, weak breakout volume, exhaustion volume, volume confirmation.
Must Not Do: 不可以決定最終下單；不可以在成交量不可見時假設成交量；不可以單靠成交量要求進場；不可以忽略價格結構；不可以忽略 Risk Manager；不可以分析使用者沒有選擇的成交量條件。
Output:
Volume Status: confirms / weak / diverging / not_visible / unclear
Breakout Quality: strong / weak / not_applicable
Continuation Support: yes / no / unclear
Reason: 簡短原因
Strict Rule: 你只負責成交量品質。如果成交量不可見，必須回報 not_visible，不可猜測。`,
    group: "specialist",
    selected: true
  },
  {
    id: "news",
    icon: "",
    name: "News",
    displayName: "事件風險官",
    shortName: "事件",
    role: "新聞風險官",
    duty: "提醒重大數據、利率決議、就業數據與央行談話等事件風險。",
    why: "避免在高衝擊新聞前後做出高風險交易。",
    promptSummary: "提醒高衝擊新聞、事件波動與是否應避免自動交易。",
    prompt: `Role: 你是 News Risk Agent，負責提醒高衝擊新聞事件與事件風險。
Scope: 你只負責判斷是否接近 CPI、FOMC、NFP、央行談話、重要經濟數據，是否因新聞造成滑價或暴衝風險，以及是否應避免自動交易。
You Should Look For: High impact news, scheduled macro event, unexpected headline risk, news-driven volatility, pre-news spread widening, post-news whipsaw.
Must Not Do: 不可以預測新聞結果；不可以假設新聞內容；不可以在沒有新聞資料時捏造事件；不可以決定最終下單；不可以忽略 Risk Manager。
Output:
News Risk: low / medium / high / unknown
Event: event_name or none or not_visible
Trading Permission: allow / caution / block_auto_trade / manual_only
Reason: 簡短原因
Strict Rule: 如果無法取得新聞日曆或事件資訊，必須回報 unknown 或 not_visible。不能捏造 CPI、FOMC、NFP 或央行事件。`,
    group: "specialist",
    selected: false
  },
  {
    id: "macro",
    icon: "",
    name: "Macro",
    displayName: "大局策略員",
    shortName: "大局",
    role: "宏觀策略員",
    duty: "觀察大方向與市場背景。",
    why: "適合較長週期或跨市場交易者。",
    promptSummary: "觀察風險偏好、跨市場方向與短線交易是否衝突。",
    prompt: `Role: 你是 Macro Agent，負責觀察較大市場背景與跨市場方向，但不做短線進場判斷。
Scope: 你只負責判斷大盤風險偏好、利率或美元背景、股指/債券/美元/黃金/加密市場之間是否有明顯關聯、是否存在明顯 risk-on / risk-off、是否適合順勢、逆勢或降低交易頻率。
You Should Look For: Risk-on / risk-off environment, broad market trend, cross-market confirmation, dollar or rate pressure, macro conflict with short-term trade, large directional bias.
Must Not Do: 不可以預測宏觀事件結果；不可以捏造看不到的跨市場資料；不可以決定最終下單；不可以要求短線交易一定服從宏觀方向；不可以使用沒有被提供或不可見的資料。
Output:
Macro Bias: risk_on / risk_off / neutral / unknown
Macro Conflict: yes / no / unclear
Suggested Posture: normal / reduce_size / avoid_trade / manual_only
Reason: 簡短原因
Strict Rule: 你只負責宏觀背景。如果資料不可見，必須回報 unknown，不可猜測。`,
    group: "specialist",
    selected: false
  }
];

const presets = [
  {
    id: "scalper",
    label: "快進快出",
    hint: "快速進出，保留核心團隊與關鍵位、流動性、成交量專家。",
    agentIds: ["risk", "oneMinute", "fiveMinute", "oneHour", "support", "liquidity", "volume"]
  },
  {
    id: "dayTrader",
    label: "日內穩定",
    hint: "日內交易配置，加入新聞風險檢查，適合回放或模擬測試。",
    agentIds: ["risk", "oneMinute", "fiveMinute", "oneHour", "support", "volume", "news"]
  },
  {
    id: "swing",
    label: "波段觀察",
    hint: "降低短線噪音，重視大方向、關鍵位、新聞與宏觀背景。",
    agentIds: ["risk", "fiveMinute", "oneHour", "support", "news", "macro"]
  },
  {
    id: "custom",
    label: "自行挑選",
    hint: "保留目前選擇，讓你手動調整團隊。",
    agentIds: null
  }
];

const indicators = [
  {
    id: "macd",
    name: "動能線",
    role: "動能轉折",
    hint: "用來觀察多空動能是否正在切換，適合搭配趨勢與回踩判斷。",
    selected: true
  },
  {
    id: "rsi",
    name: "強弱指標",
    role: "強弱與過熱",
    hint: "用來觀察市場是否過熱、過弱，避免追在太極端的位置。",
    selected: true
  },
  {
    id: "vwap",
    name: "日內均價",
    role: "日內均衡價",
    hint: "日內交易常用，用來判斷價格偏多、偏空或回到公平區。",
    selected: true
  },
  {
    id: "kdj",
    name: "短線轉折",
    role: "短線轉折",
    hint: "用來輔助觀察短線反轉與鈍化，但需要搭配結構確認。",
    selected: false
  },
  {
    id: "ema",
    name: "趨勢均線",
    role: "趨勢方向",
    hint: "用來判斷短中期方向與回踩位置，不應單獨當作進場理由。",
    selected: false
  },
  {
    id: "volume",
    name: "成交量",
    role: "成交量確認",
    hint: "用來觀察突破是否有量、回踩是否縮量。",
    selected: true
  },
  {
    id: "atr",
    name: "波動範圍",
    role: "波動與止損距離",
    hint: "用來判斷波動是否過大，以及止損與目標是否合理。",
    selected: false
  },
  {
    id: "supportResistance",
    name: "支撐 / 壓力",
    role: "關鍵價位",
    hint: "用來避免在壓力前追多，或在支撐前追空。",
    selected: true
  }
];

const agentPersona = {
  risk:       { color: "#ff5f57", quote: "「不確定？那就不准動手。」" },
  oneMinute:  { color: "#d6a13d", quote: "「我只看這一秒的破綻，但不下最後決定。」" },
  fiveMinute: { color: "#19c37d", quote: "「等型態真正成立，別被一根棒騙了。」" },
  oneHour:    { color: "#4fb3ff", quote: "「別跟大方向作對。」" },
  support:    { color: "#a88cff", quote: "「只在關鍵價扣板機，不在壓力前追多。」" },
  liquidity:  { color: "#2dd4bf", quote: "「這是真突破，還是陷阱？」" },
  volume:     { color: "#f472b6", quote: "「沒有量，我不背書。」" },
  news:       { color: "#94a3b8", quote: "「CPI 還有三分鐘，先停。」" },
  macro:      { color: "#38bdf8", quote: "「先看懂這盤大局。」" }
};

const displayLabels = {
  mode: {
    "Replay Auto": "回放自動練習",
    "Paper Auto": "紙上自動測試",
    "Demo Auto": "模擬帳戶自動測試",
    "Live View": "真實帳戶只觀察",
    "Live Approve": "真實帳戶每次確認",
    "Live Auto": "真實帳戶自動執行"
  },
  verbosity: {
    Compact: "精簡",
    Normal: "一般",
    Review: "檢查"
  },
  personality: {
    Scalper: "快進快出",
    "Day Trader": "日內交易",
    "Swing Trader": "波段交易",
    "Position Trader": "長線部位",
    "Hybrid Trader": "混合節奏"
  }
};

function displayText(key, value) {
  return displayLabels[key]?.[value] || value;
}

function publicAgentName(agent) {
  return agent.displayName || agent.name;
}

function personaFor(id) {
  return agentPersona[id] || { color: "#8f9aa3", quote: "" };
}

const personalityArchetype = {
  "Scalper":         { from: 4,  to: 14, label: "數秒～數分鐘", ticks: 9 },
  "Day Trader":      { from: 8,  to: 40, label: "當日進出，不留倉", ticks: 5 },
  "Swing Trader":    { from: 18, to: 78, label: "持有數日", ticks: 5 },
  "Position Trader": { from: 10, to: 96, label: "週～月級別", ticks: 5 },
  "Hybrid Trader":   { from: 6,  to: 60, label: "短線＋結構混合", ticks: 6, dashed: true }
};

function archetypeSvg(title) {
  const a = personalityArchetype[title];
  if (!a) return "";
  const W = 200, H = 42, y = 20;
  const x1 = (a.from / 100) * W;
  const x2 = (a.to / 100) * W;
  let ticks = "";
  for (let i = 0; i <= a.ticks; i++) {
    const tx = ((i / a.ticks) * W).toFixed(1);
    ticks += `<line x1="${tx}" y1="${y - 4}" x2="${tx}" y2="${y + 4}" stroke="#27323b" stroke-width="1"/>`;
  }
  return `<svg class="archetype" viewBox="0 0 ${W} ${H}" role="img" aria-label="典型持倉週期：${a.label}">
    <line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="#27323b" stroke-width="1"/>
    ${ticks}
    <rect x="${x1.toFixed(1)}" y="${y - 6}" width="${(x2 - x1).toFixed(1)}" height="12" rx="6" fill="currentColor" opacity="0.9"${a.dashed ? ' stroke="#05070a" stroke-dasharray="3 3"' : ""}/>
    <text x="0" y="${H - 2}" fill="#8f9aa3" font-size="9">${a.label}</text>
  </svg>`;
}

function flowBox(x, label, sub, color) {
  return `<g>
    <rect x="${x}" y="40" width="190" height="86" rx="12" fill="${color}1f" stroke="${color}" stroke-width="1.5"/>
    <text x="${x + 95}" y="80" text-anchor="middle" fill="#eef3f0" font-size="18" font-weight="700">${label}</text>
    <text x="${x + 95}" y="106" text-anchor="middle" fill="#9aa6af" font-size="12">${sub}</text>
  </g>`;
}

function buildFlowDiagram() {
  const arrow = x => `<line x1="${x}" y1="83" x2="${x + 45}" y2="83" stroke="#3a4750" stroke-width="2" marker-end="url(#fa)"/>`;
  return `<svg viewBox="0 0 945 158" width="100%" role="img" aria-label="每輪交易動線：讀畫面、角色檢查、風控主管否決權、輸出行動卡">
    <defs><marker id="fa" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1L8 5L1 9" fill="none" stroke="#9aa6af" stroke-width="1.5"/></marker></defs>
    ${flowBox(10, "讀畫面", "確認帳戶與商品狀態", "#4fb3ff")}
    ${arrow(200)}
    ${flowBox(255, "角色檢查", "各自提出支持與風險", "#19c37d")}
    ${arrow(445)}
    ${flowBox(500, "風控主管", "握有否決權，可一票喊停", "#ff5f57")}
    ${arrow(690)}
    ${flowBox(745, "行動卡", "等待 / 進場 / 人工確認", "#c7a45d")}
    <text x="595" y="147" text-anchor="middle" fill="#ff5f57" font-size="12" font-weight="700">否決 = 停手</text>
  </svg>`;
}

const recoveryItems = [
  { tag: "帳戶", title: "帳戶模式看不清", why: "無法確認是模擬還是真實帳戶。", next: "切到模擬、紙上或回放分頁，讓頂部帳戶標籤清楚可見。" },
  { tag: "正式", title: "偵測到真實帳戶", why: "你尚未授權真實資金交易。", next: "改用模擬、紙上或回放，或在模式選擇明確授權。" },
  { tag: "口數", title: "口數欄位被遮住", why: "看不到口數，就不能安全確認下單量。", next: "展開下單面板，讓口數欄位可見。" },
  { tag: "損益", title: "當日損益不可見", why: "無法確認今日風險狀態。", next: "打開帳戶或部位面板顯示損益。" },
  { tag: "出場", title: "平倉按鈕不可見", why: "不能安全管理既有部位。", next: "確認平倉 / 出場按鈕在畫面上。" },
  { tag: "成交", title: "上一次點擊成交不明", why: "避免重複下單造成超倉。", next: "等成交狀態確認後，再進入下一輪。" }
];

const ASSUMED_USD_PER_M = 5;

const state = {
  step: 0,
  reached: 0,
  market: null,
  mode: null,
  personality: null,
  heartbeatVerbosity: "Compact",
  goal: null,
  style: null,
  preset: "scalper",
  risk: {
    profitTarget: 3000,
    stopLoss: 1500,
    dailyLoss: 2000,
    minimumRR: 1.5,
    maxContracts: 8,
    addOnRule: "不允許加碼"
  },
  schedule: {
    intervalSeconds: 60,
    useWindow: false,
    days: [1, 2, 3, 4, 5],
    startTime: "",
    endTime: ""
  }
};

const $ = id => document.getElementById(id);

const validationMessages = {
  market: "請先選擇市場，再進入下一步。",
  mode: "請先選擇使用模式。",
  personality: "請先選擇交易人格，再進入下一步。",
  goalStyle: "請先選擇交易目標與交易風格，再進入指標選擇。",
  indicators: "請至少選擇 1 個參考指標，讓設定檔能產生畫面提示規格。",
  risk: "請確認風控與自動執行設定：止損與每日最大虧損必須大於 0，最低盈虧比至少 0.5，最大口數與執行間隔必須是 1 以上的整數。",
  agents: "請至少選擇 3 位交易角色，並保留風控主管。"
};

function init() {
  loadState();
  const flow = $("flowDiagram");
  if (flow) flow.innerHTML = buildFlowDiagram();
  renderChoices("marketChoices", "market");
  renderChoices("modeChoices", "mode");
  renderChoices("verbosityChoices", "verbosity");
  renderChoices("personalityChoices", "personality");
  renderChoices("goalChoices", "goal");
  renderChoices("styleChoices", "style");
  renderIndicators();
  renderPresets();
  renderAgents();
  bindEvents();
  syncRiskInputs();
  updateWizard();
  updateSelectedChoices();
  updateSummary();
  track("wizard_open", { step: state.step });
}

const STORAGE_KEY = "ai-trading-starter-v2";

function saveState() {
  try {
    const snapshot = {
      step: state.step,
      reached: state.reached,
      market: state.market,
      mode: state.mode,
      personality: state.personality,
      heartbeatVerbosity: state.heartbeatVerbosity,
      goal: state.goal,
      style: state.style,
      preset: state.preset,
      risk: state.risk,
      schedule: state.schedule,
      indicatorIds: selectedIndicators().map(i => i.id),
      agentIds: selectedAgents().map(a => a.id)
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    showSaveHint();
  } catch (error) {
    /* localStorage unavailable (private mode); continue without persistence */
  }
}

function loadState() {
  let saved;
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  } catch {
    saved = null;
  }
  if (!saved) return;
  ["market", "mode", "personality", "heartbeatVerbosity", "goal", "style", "preset"].forEach(key => {
    if (saved[key] != null) state[key] = saved[key];
  });
  if (saved.risk) Object.assign(state.risk, saved.risk);
  if (saved.schedule) Object.assign(state.schedule, saved.schedule);
  if (Array.isArray(saved.indicatorIds)) {
    indicators.forEach(item => { item.selected = saved.indicatorIds.includes(item.id); });
  }
  if (Array.isArray(saved.agentIds) && saved.agentIds.length) {
    agents.forEach(agent => { agent.selected = agent.locked || saved.agentIds.includes(agent.id); });
  }
  state.step = Number.isInteger(saved.step) ? saved.step : 0;
  state.reached = Math.max(state.step, Number.isInteger(saved.reached) ? saved.reached : 0);
}

let saveHintTimer = null;
function showSaveHint() {
  const el = $("saveHint");
  if (!el) return;
  el.textContent = "已自動保存";
  el.classList.add("show");
  clearTimeout(saveHintTimer);
  saveHintTimer = setTimeout(() => el.classList.remove("show"), 1400);
}

function track(event, payload = {}) {
  const record = { event, ts: Date.now(), ...payload };
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(record);
  if (window.console && console.debug) console.debug("[starter]", event, record);
}

function renderStepNav() {
  const nav = $("stepNav");
  if (!nav) return;
  nav.innerHTML = steps.map((step, index) => {
    const reachable = index <= state.reached;
    const classes = ["step-dot"];
    if (index === state.step) classes.push("current");
    else if (index < state.step) classes.push("done");
    if (!reachable) classes.push("locked");
    return `<button class="${classes.join(" ")}" type="button" data-stepidx="${index}" ${reachable ? "" : "disabled"} title="${step.title}"><b>${index + 1}</b><span>${step.title}</span></button>`;
  }).join("");
}

function renderChoices(containerId, key) {
  const container = $(containerId);
  const isPersona = key === "personality";
  container.innerHTML = options[key].map(([title, description]) => `
    <button class="choice${isPersona ? " choice-persona" : ""}" type="button" data-key="${key}" data-value="${title}" title="${description}">
      <strong>${displayText(key, title)}</strong>
      <span>${description}</span>
      ${isPersona ? archetypeSvg(title) : ""}
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
  return agents.filter(agent => agent.group === group).map((agent, index) => {
    const persona = personaFor(agent.id);
    const status = agent.locked ? "固定成員" : agent.selected ? "已加入團隊" : "加入團隊";
    return `
    <button class="agent-card persona ${agent.selected ? "selected" : ""}" type="button" data-agent="${agent.id}" title="${agent.why}" style="--persona:${persona.color}; --stance:${index - 1}" ${agent.locked ? "aria-disabled=\"true\"" : ""}>
      <span class="agent-figure" aria-hidden="true"><span></span></span>
      <span class="agent-copy">
        <strong>${publicAgentName(agent)}</strong>
        <span class="agent-role">${agent.role}</span>
        <span>${agent.duty}</span>
        <small>${status}</small>
      </span>
      <span class="agent-hover">
        <b>${persona.quote || agent.why}</b>
        <span>${agent.why}</span>
        <span>負責：${agent.promptSummary || agent.duty}</span>
      </span>
    </button>
  `;
  }).join("");
}

function bindEvents() {
  document.querySelectorAll(".choice").forEach(button => {
    button.addEventListener("click", () => {
      if (button.dataset.key === "verbosity") {
        state.heartbeatVerbosity = button.dataset.value;
      } else {
        state[button.dataset.key] = button.dataset.value;
      }
      markDirty();
      updateSelectedChoices();
      updateSummary();
      const shouldAutoAdvance = !["goal", "style", "verbosity"].includes(button.dataset.key);
      if (shouldAutoAdvance && state.step < 4) {
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

  [
    ["executionIntervalInput", "intervalSeconds", toRiskNumber],
    ["executionStartInput", "startTime", value => value],
    ["executionEndInput", "endTime", value => value]
  ].forEach(([id, key, normalize]) => {
    $(id).addEventListener("input", event => {
      state.schedule[key] = normalize(event.target.value);
      markDirty();
      markRiskValidity();
      updateSummary();
    });
    $(id).addEventListener("change", event => {
      state.schedule[key] = normalize(event.target.value);
      markDirty();
      markRiskValidity();
      updateSummary();
    });
  });

  $("scheduleAlwaysBtn").addEventListener("click", () => {
    state.schedule.useWindow = false;
    markDirty();
    syncScheduleControls();
    updateSummary();
  });

  $("scheduleWindowBtn").addEventListener("click", () => {
    state.schedule.useWindow = true;
    markDirty();
    syncScheduleControls();
    updateSummary();
  });

  $("weekdaysBtn").addEventListener("click", () => {
    state.schedule.days = [1, 2, 3, 4, 5];
    state.schedule.useWindow = true;
    markDirty();
    syncScheduleControls();
    updateSummary();
  });

  $("everydayBtn").addEventListener("click", () => {
    state.schedule.days = [0, 1, 2, 3, 4, 5, 6];
    state.schedule.useWindow = true;
    markDirty();
    syncScheduleControls();
    updateSummary();
  });

  document.querySelectorAll(".weekday-picker input").forEach(input => {
    input.addEventListener("change", () => {
      state.schedule.useWindow = true;
      state.schedule.days = selectedScheduleDaysFromInputs();
      markDirty();
      syncScheduleControls();
      updateSummary();
    });
  });

  $("backBtn").addEventListener("click", () => goToStep(state.step - 1));
  $("nextBtn").addEventListener("click", () => {
    if (!validateStep(state.step)) {
      track("step_invalid", { step: state.step, key: steps[state.step].key });
      return;
    }
    track("step_complete", { step: state.step, key: steps[state.step].key });
    if (state.step < steps.length - 1) {
      goToStep(state.step + 1);
      return;
    }
    showResults();
  });

  $("stepNav").addEventListener("click", event => {
    const dot = event.target.closest(".step-dot");
    if (!dot || dot.disabled) return;
    goToStep(Number(dot.dataset.stepidx));
  });

  $("resetWizardBtn").addEventListener("click", () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    track("wizard_reset", {});
    location.reload();
  });

  $("shareTeamBtn").addEventListener("click", () => {
    shareTeamImage();
    track("share_team", { agents: selectedAgents().length });
  });

  $("togglePromptBtn").addEventListener("click", () => {
    $("promptPanel").classList.toggle("is-collapsed");
    $("togglePromptBtn").textContent = $("promptPanel").classList.contains("is-collapsed")
      ? "展開完整設定檔"
      : "收合完整設定檔";
  });

  $("copyPromptBtn").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText($("promptOutput").value);
      flashButton($("copyPromptBtn"), "已複製到剪貼簿");
      track("copy_prompt", { chars: $("promptOutput").value.length });
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
    link.download = "trading-starter-settings.md";
    link.click();
    URL.revokeObjectURL(url);
    track("download_markdown", {});
  });

  $("copyStarterBtn").addEventListener("click", async () => {
    const card = buildSessionStarterCard();
    try {
      await navigator.clipboard.writeText(card);
      flashButton($("copyStarterBtn"), "已複製，貼到 Codex");
      track("copy_starter", { chars: card.length });
    } catch {
      flashButton($("copyStarterBtn"), "複製失敗，請手動選取");
    }
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
  state.reached = Math.max(state.reached, state.step);
  saveState();
  track("step_enter", { step: state.step, key: steps[state.step].key });
  updateWizard();
  $("starter")?.scrollIntoView?.({ behavior: "smooth", block: "start" });
}

function markDirty() {
  saveState();
  if (!$("results").classList.contains("is-hidden")) {
    $("results").classList.add("is-hidden");
    $("readiness").textContent = "設定已更新，請重新產生設定檔。";
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
    goalStyle: Boolean(state.goal) && Boolean(state.style),
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
  $("nextBtn").textContent = state.step === steps.length - 1 ? "產生設定檔" : "下一步";
  renderStepNav();
  if (steps[state.step].key === "risk") markRiskValidity();
}

function syncRiskInputs() {
  $("profitTargetInput").value = state.risk.profitTarget;
  $("stopLossInput").value = state.risk.stopLoss;
  $("dailyLossInput").value = state.risk.dailyLoss;
  $("minimumRRInput").value = state.risk.minimumRR;
  $("maxContractsInput").value = state.risk.maxContracts;
  $("addOnRuleInput").value = state.risk.addOnRule;
  $("executionIntervalInput").value = state.schedule.intervalSeconds;
  $("executionStartInput").value = state.schedule.startTime;
  $("executionEndInput").value = state.schedule.endTime;
  syncScheduleControls();
  markRiskValidity();
}

function syncScheduleControls() {
  $("scheduleAlwaysBtn").classList.toggle("selected", !state.schedule.useWindow);
  $("scheduleWindowBtn").classList.toggle("selected", state.schedule.useWindow);
  $("scheduleWindowPanel").classList.toggle("is-hidden", !state.schedule.useWindow);
  const selectedDays = new Set(state.schedule.days);
  document.querySelectorAll(".weekday-picker input").forEach(input => {
    input.checked = selectedDays.has(Number(input.value));
    input.closest("label")?.classList.toggle("selected", input.checked);
  });
  $("weekdaysBtn").classList.toggle("selected", isSameDays(state.schedule.days, [1, 2, 3, 4, 5]));
  $("everydayBtn").classList.toggle("selected", isSameDays(state.schedule.days, [0, 1, 2, 3, 4, 5, 6]));
}

function selectedScheduleDaysFromInputs() {
  return Array.from(document.querySelectorAll(".weekday-picker input:checked"))
    .map(input => Number(input.value))
    .sort((a, b) => a - b);
}

function isSameDays(a, b) {
  return a.length === b.length && a.every((day, index) => day === b[index]);
}

function markRiskValidity() {
  const fieldChecks = [
    ["profitTargetInput", Number(state.risk.profitTarget) >= 0],
    ["stopLossInput", Number(state.risk.stopLoss) > 0],
    ["dailyLossInput", Number(state.risk.dailyLoss) > 0],
    ["minimumRRInput", Number(state.risk.minimumRR) >= 0.5],
    ["maxContractsInput", Number(state.risk.maxContracts) >= 1 && Number.isInteger(Number(state.risk.maxContracts))],
    ["executionIntervalInput", Number(state.schedule.intervalSeconds) >= 1 && Number.isInteger(Number(state.schedule.intervalSeconds))]
  ];
  fieldChecks.forEach(([id, isValid]) => {
    const field = $(id).closest(".risk-field");
    field.classList.toggle("invalid", !isValid);
  });
}

function updateSelectedChoices() {
  document.querySelectorAll(".choice").forEach(button => {
    const selectedValue = button.dataset.key === "verbosity"
      ? state.heartbeatVerbosity
      : state[button.dataset.key];
    button.classList.toggle("selected", selectedValue === button.dataset.value);
  });
}

function updateSummary() {
  $("summaryMarket").textContent = state.market || "尚未選擇";
  $("summaryMode").textContent = state.mode ? displayText("mode", state.mode) : "尚未選擇";
  $("summaryPersonality").textContent = state.personality ? displayText("personality", state.personality) : "尚未選擇";
  $("summaryGoal").textContent = state.goal || "尚未選擇";
  $("summaryStyle").textContent = state.style || "尚未選擇";
  $("summaryIndicators").textContent = selectedIndicators().length
    ? selectedIndicators().map(indicator => indicator.name).join(" / ")
    : "尚未選擇";
  $("summaryVerbosity").textContent = displayText("verbosity", state.heartbeatVerbosity);
  $("summarySchedule").textContent = formatScheduleSummary();
  $("summaryProfitTarget").textContent = formatMoneyLike(state.risk.profitTarget);
  $("summaryStopLoss").textContent = formatMoneyLike(state.risk.stopLoss);
  $("summaryDailyRisk").textContent = `${formatMoneyLike(state.risk.dailyLoss)} / 盈虧比 ${formatRiskNumber(state.risk.minimumRR)}`;
  $("summaryAgents").textContent = `${selectedAgents().length} 位已選`;
  $("readiness").textContent = isReady()
    ? "設定已完成，可以產生交易設定檔。"
    : "完成 7 個步驟後，會顯示交易設定摘要。";
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
  $("tokenEstimate").textContent = `約 ${tokenEstimate.toLocaleString()} 字`;
  $("qualityEstimate").textContent = `${"★".repeat(qualityScore)}${"☆".repeat(5 - qualityScore)}`;
  $("teamDebatePreview").innerHTML = buildTeamDebatePreview().map(item => `
    <div>
      <span>${item.agent}</span>
      <strong class="${item.tone}">${item.vote}</strong>
    </div>
  `).join("");
  $("teamFinalVote").textContent = specialists >= 2 && core >= 4 ? "偏多通過" : "等待確認";
  updateAgentCount();
}

function buildTeamDebatePreview() {
  const selectedIds = new Set(selectedAgents().map(agent => agent.id));
  const items = [
    { agent: "即時交易員", vote: selectedIds.has("oneMinute") ? "偏多" : "等待", tone: "agree" },
    { agent: "風控主管", vote: "否決", tone: "reject" },
    { agent: "成交量分析員", vote: selectedIds.has("volume") ? "同意" : "資料不足", tone: selectedIds.has("volume") ? "agree" : "neutral" },
    { agent: "大方向觀察員", vote: selectedIds.has("oneHour") ? "同意" : "方向不足", tone: selectedIds.has("oneHour") ? "agree" : "neutral" }
  ];
  return items;
}

function selectedAgents() {
  return agents.filter(agent => agent.selected);
}

function selectedIndicators() {
  return indicators.filter(indicator => indicator.selected);
}

function selectedRequiredIndicators() {
  return indicators.filter(indicator => indicator.selected && indicator.required);
}

function selectedOptionalIndicators() {
  return indicators.filter(indicator => indicator.selected && !indicator.required);
}

function buildEntryGate() {
  const presetLabel = presets.find(preset => preset.id === state.preset)?.label || "";
  const isAggressive = state.style === "進攻" && presetLabel === "Scalper";
  if (isAggressive) {
    return {
      label: "Aggressive / 進攻 Scalper",
      setupScore: 65,
      confidence: 62,
      addConfidence: 65
    };
  }
  const isConservative = state.style === "保守";
  if (isConservative) {
    return {
      label: "Balanced floor for Conservative / 保守最低 Balanced",
      setupScore: 70,
      confidence: 66,
      addConfidence: 72
    };
  }
  return {
    label: "Balanced / Hybrid",
    setupScore: 70,
    confidence: 66,
    addConfidence: 68
  };
}

function allowsAddOn() {
  return state.risk.addOnRule !== "不允許加碼";
}

function buildAddOnPolicy() {
  if (!allowsAddOn()) {
    return `本輪設定加碼規則：不允許加碼。
所有 Add-on / Scale-in / DCA / Averaging down 一律禁止。
若已有持倉，只允許持有、減倉、平倉或風控處理。`;
  }
  const gate = buildEntryGate();
  return `本輪設定加碼規則：${state.risk.addOnRule}。
只有計畫型加碼才可評估：
1. 原交易 thesis 尚未失效。
2. 價格到達使用者設定或系統候選 add zone。
3. 加碼後總口數 <= ${state.risk.maxContracts}。
4. 加碼後總風險仍 <= ${formatMoneyLike(state.risk.stopLoss)}。
5. 加碼後 RR >= ${state.risk.minimumRR}。
6. position 與 working orders 明確。
7. 不是 Real / Live 未授權環境。
8. confidence >= ${gate.addConfidence}。`;
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
    Number.isInteger(Number(state.risk.maxContracts)) &&
    Number.isFinite(Number(state.schedule.intervalSeconds)) &&
    Number(state.schedule.intervalSeconds) >= 1 &&
    Number.isInteger(Number(state.schedule.intervalSeconds)) &&
    (!state.schedule.useWindow || state.schedule.days.length >= 1)
  );
}

function formatMoneyLike(value) {
  return Number.isFinite(Number(value)) ? `${Number(value).toLocaleString()}` : "未設定";
}

function formatRiskNumber(value) {
  return Number.isFinite(Number(value)) ? Number(value).toLocaleString() : "未設定";
}

function formatScheduleSummary() {
  const interval = Number.isFinite(Number(state.schedule.intervalSeconds))
    ? `${Number(state.schedule.intervalSeconds).toLocaleString()} 秒`
    : "未設定";
  if (!state.schedule.useWindow) return `每 ${interval}，不限制時段`;
  const days = formatScheduleDays();
  const start = state.schedule.startTime || "不限開始";
  const end = state.schedule.endTime || "不限結束";
  return `每 ${interval}，${days}，${start} 到 ${end}`;
}

function formatScheduleDays() {
  const labels = ["日", "一", "二", "三", "四", "五", "六"];
  if (isSameDays(state.schedule.days, [1, 2, 3, 4, 5])) return "週一到週五";
  if (isSameDays(state.schedule.days, [0, 1, 2, 3, 4, 5, 6])) return "每天";
  return state.schedule.days.map(day => labels[day]).join(" / ") || "未選擇星期";
}

function showResults() {
  if (!isReady()) {
    $("readiness").textContent = "請先完成市場、使用模式、人格、目標、風格、參考指標、風控設定，並至少選擇 3 位交易角色。";
    return;
  }
  renderResults();
  $("results").classList.remove("is-hidden");
  $("results").scrollIntoView?.({ behavior: "smooth", block: "start" });
  track("prompt_generated", {
    market: state.market,
    mode: state.mode,
    agents: selectedAgents().length,
    indicators: selectedIndicators().length,
    quality: buildPromptQuality().grade
  });
}

function renderResults() {
  const summary = [
    ["市場", state.market],
    ["使用模式", displayText("mode", state.mode)],
    ["交易人格", displayText("personality", state.personality)],
    ["目標", state.goal],
    ["風格", state.style],
    ["參考指標", selectedIndicators().map(indicator => indicator.name).join(" / ")],
    ["每日盈利目標", formatMoneyLike(state.risk.profitTarget)],
    ["單筆最大止損", formatMoneyLike(state.risk.stopLoss)],
    ["每日最大虧損", formatMoneyLike(state.risk.dailyLoss)],
    ["最低盈虧比", state.risk.minimumRR],
    ["最大口數", state.risk.maxContracts],
    ["加碼規則", state.risk.addOnRule],
    ["進場門檻", `分數 ${buildEntryGate().setupScore} / 信心 ${buildEntryGate().confidence}`],
    ["自動執行排程", formatScheduleSummary()],
    ["輸出長度", displayText("verbosity", state.heartbeatVerbosity)],
    ["快速組合", presets.find(preset => preset.id === state.preset)?.label || "自行挑選"],
    ["執行範圍", modeExecutionScope()],
    ["安全設定", "不把任何訊號視為真實帳戶自動交易授權"]
  ];
  $("strategySummary").innerHTML = summary.map(([label, value]) => `
    <div class="summary-item"><strong>${label}</strong><br>${value}</div>
  `).join("");

  $("selectedAgents").innerHTML = selectedAgents().map(agent => {
    const persona = personaFor(agent.id);
    return `
    <div class="selected-agent persona" style="--persona:${persona.color}">
      <strong><span class="persona-dot"></span>${publicAgentName(agent)} · ${agent.role}</strong>
      <span>${persona.quote || agent.promptSummary || agent.duty}</span>
    </div>
  `;
  }).join("");

  $("debateFlow").innerHTML = buildDebateItems().map(item => `
    <div class="debate-item">
      <strong>${item.title}</strong>
      ${item.text}
    </div>
  `).join("");

  $("promptOutput").value = buildPrompt();

  const quality = buildPromptQuality();
  const qualityEl = $("promptQualityBadge");
  if (qualityEl) {
    qualityEl.textContent = `${quality.grade} — ${quality.label}`;
    qualityEl.title = quality.note;
    qualityEl.dataset.grade = quality.grade;
  }

  renderCostEstimate();
  renderPlatformGuide();
  renderRecovery();
}

function estimateCost() {
  const interval = Number(state.schedule.intervalSeconds) > 0 ? Number(state.schedule.intervalSeconds) : 60;
  const roundsPerHour = Math.round(3600 / interval);
  const agentsN = selectedAgents().length;
  const v = state.heartbeatVerbosity;
  const outLow = v === "Review" ? 600 : v === "Normal" ? 250 : 110;
  const outHigh = v === "Review" ? 1300 : v === "Normal" ? 420 : 180;
  const inLow = 1100 + agentsN * 120;
  const inHigh = 1600 + agentsN * 380 + 1500;
  const perRoundLow = inLow + outLow;
  const perRoundHigh = inHigh + outHigh;
  const hourLow = perRoundLow * roundsPerHour;
  const hourHigh = perRoundHigh * roundsPerHour;
  const activeHours = 6.5;
  const dayLow = hourLow * activeHours;
  const dayHigh = hourHigh * activeHours;
  const usd = tokens => (tokens / 1e6) * ASSUMED_USD_PER_M;
  return { interval, roundsPerHour, perRoundLow, perRoundHigh, hourLow, hourHigh, dayLow, dayHigh, usdDayLow: usd(dayLow), usdDayHigh: usd(dayHigh) };
}

function tk(n) {
  return Math.round(n).toLocaleString();
}

function renderCostEstimate() {
  const target = $("costReadout");
  if (!target) return;
  const c = estimateCost();
  const rows = [
    ["每輪", `${tk(c.perRoundLow)}–${tk(c.perRoundHigh)} 字元量`],
    [`每小時（${c.roundsPerHour} 輪）`, `${tk(c.hourLow)}–${tk(c.hourHigh)} 字元量`],
    ["每日（約 6.5 交易小時）", `${tk(c.dayLow)}–${tk(c.dayHigh)} 字元量`],
    ["估計成本 / 日", `$${c.usdDayLow.toFixed(2)}–$${c.usdDayHigh.toFixed(2)}`]
  ];
  target.innerHTML = rows.map(([label, value]) => `
    <div class="cost-row"><span>${label}</span><strong>${value}</strong></div>
  `).join("");
  $("costNote").textContent = `區間估算，非保證值。讀截圖的視覺分析成本遠高於純文字輸出，且每縮短一半間隔，成本約翻倍。美金以假設混合 $${ASSUMED_USD_PER_M} / 百萬字元量推估，實際依你的方案與快取而定。`;
}

function platformGuideSteps(platform) {
  if (platform === "Tradovate") {
    return {
      url: "app.tradovate.com",
      steps: [
        "開啟並登入 Tradovate 網頁版。",
        `確認頂部帳戶標籤顯示模擬帳戶（非正式帳戶），商品為 ${state.market}。`,
        "確認下單面板可見：口數欄位、買進 / 賣出按鈕、帳戶損益、部位面板。",
        "使用上方快速啟動卡，開始第一輪檢查。"
      ]
    };
  }
  if (platform === "Binance") {
    return {
      url: "testnet.binance.vision",
      steps: [
        "開啟 testnet.binance.vision（不是正式 binance.com）。",
        `確認是測試網（餘額為測試資金），交易對為 ${state.market}/USDT。`,
        "確認數量欄位、買進 / 賣出按鈕、餘額或持倉面板可見。",
        "使用上方快速啟動卡，開始第一輪檢查。"
      ]
    };
  }
  return {
    url: "tradingview.com",
    steps: [
      "開啟 TradingView 並登入。",
      "開啟右側紙上交易面板，確認顯示測試資金餘額。",
      `確認圖表頂部商品代碼正確（${state.market}），數量欄位與買進 / 賣出可見。`,
      "使用上方快速啟動卡，開始第一輪檢查。"
    ]
  };
}

function renderPlatformGuide() {
  const target = $("platformGuide");
  if (!target) return;
  const platform = inferPlatform();
  const guide = platformGuideSteps(platform);
  target.innerHTML = `
    <div class="platform-head"><strong>${platform}</strong><span>${guide.url}</span></div>
    <ol>${guide.steps.map(step => `<li>${step}</li>`).join("")}</ol>
  `;
}

function renderRecovery() {
  const target = $("recoveryGrid");
  if (!target) return;
  target.innerHTML = recoveryItems.map(item => `
    <div class="recovery-item">
      <span class="recovery-tag">${item.tag}</span>
      <strong>${item.title}</strong>
      <span class="recovery-why">${item.why}</span>
      <span class="recovery-next"><b>你的下一步：</b>${item.next}</span>
    </div>
  `).join("");
}

function shareTeamImage() {
  const canvas = $("shareCanvas");
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext("2d");
  const W = 1200;
  const H = 630;
  ctx.fillStyle = "#05070a";
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "#27323b";
  ctx.lineWidth = 2;
  ctx.strokeRect(24, 24, W - 48, H - 48);
  ctx.fillStyle = "#c7a45d";
  ctx.font = "700 26px Inter, 'Noto Sans TC', sans-serif";
  ctx.fillText("交易角色設定台", 60, 84);
  ctx.fillStyle = "#eef3f0";
  ctx.font = "700 56px Inter, 'Noto Sans TC', sans-serif";
  ctx.fillText("我的交易角色團隊", 60, 150);
  ctx.fillStyle = "#8f9aa3";
  ctx.font = "400 22px Inter, 'Noto Sans TC', sans-serif";
  ctx.fillText(`${state.market} · ${displayText("mode", state.mode)} · ${selectedAgents().length} 位角色`, 60, 190);
  selectedAgents().forEach((agent, i) => {
    const x = i < 5 ? 70 : 640;
    const y = 252 + (i % 5) * 70;
    const persona = personaFor(agent.id);
    ctx.fillStyle = persona.color;
    ctx.beginPath();
    ctx.arc(x + 12, y - 8, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#eef3f0";
    ctx.font = "700 24px Inter, 'Noto Sans TC', sans-serif";
    ctx.fillText(publicAgentName(agent), x + 40, y);
    ctx.fillStyle = "#9aa6af";
    ctx.font = "400 16px Inter, 'Noto Sans TC', sans-serif";
    ctx.fillText((persona.quote || agent.role).slice(0, 24), x + 40, y + 24);
  });
  ctx.fillStyle = "#8f9aa3";
  ctx.font = "400 18px Inter, 'Noto Sans TC', sans-serif";
  ctx.fillText("不確定時，先停手 · 預設模擬、紙上或回放測試", 60, H - 50);
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "my-ai-trading-team.png";
  link.click();
}

function inferPlatform() {
  if (["MNQ", "NQ", "ES", "MES"].includes(state.market)) return "Tradovate";
  if (["BTC", "ETH"].includes(state.market)) return "Binance";
  return "TradingView Paper";
}

function buildPlatformRules() {
  const platform = inferPlatform();
  const isAutoMode = ["Demo Auto", "Paper Auto", "Replay Auto", "Live Auto"].includes(state.mode);

  if (platform === "Tradovate") {
    return `## 平台操作規範（Tradovate）
1. 在 Codex in-app browser 開啟 Tradovate 網頁版（app.tradovate.com）。
2. 每輪 heartbeat 開始前先確認：頂部帳戶標籤顯示 "Demo"（非 Live）。
3. 商品確認：畫面頂部或下單面板顯示 ${state.market}，不得假設商品名稱。
4. 下單前必須確認可見：口數欄位、Buy / Sell 按鈕、帳戶 PnL、Position 面板。
5. ${isAutoMode ? `${state.mode} 允許自動點擊：確認所有條件通過後，每輪最多點擊一次 Buy / Sell / Exit at Mkt & Cxl。` : "此模式不允許自動點擊任何按鈕。"}
6. 點擊後等待成交確認（fill status），不得重複點擊。
7. 帳戶模式不明、商品不明、口數不可見時：輸出 MANUAL，Reason: 請確認 Tradovate 帳戶模式為 Demo。`;
  }

  if (platform === "Binance") {
    return `## 平台操作規範（Binance Testnet）
1. 在 Codex in-app browser 開啟 testnet.binance.vision（非正式 binance.com）。
2. 每輪 heartbeat 開始前先確認：畫面顯示測試網標示或帳戶餘額為測試資金。
3. 商品確認：畫面顯示 ${state.market}/USDT 或對應交易對。
4. 下單前必須確認可見：數量欄位、Buy / Sell 按鈕、帳戶餘額或持倉面板。
5. ${isAutoMode ? `${state.mode} 允許自動點擊：確認所有條件通過後，每輪最多點擊一次 Buy / Sell / Close Position。` : "此模式不允許自動點擊任何按鈕。"}
6. 點擊後等待訂單成交確認，不得重複送出。
7. 看到正式 binance.com 或真實餘額時：立即停止，輸出 MANUAL，Reason: 偵測到可能是正式帳戶，請確認使用 Testnet。`;
  }

  return `## 平台操作規範（TradingView Paper Trading）
1. 在 Codex in-app browser 開啟 TradingView，確認右側 Paper Trading 面板已啟用。
2. 每輪 heartbeat 開始前先確認：Paper Trading 面板可見，顯示測試資金餘額。
3. 商品確認：圖表頂部顯示正確商品代碼。
4. 下單前必須確認可見：數量欄位、Buy / Sell 按鈕、Paper Trading 持倉狀態。
5. ${isAutoMode ? `${state.mode} 允許自動點擊：確認所有條件通過後，每輪最多點擊一次 Buy / Sell / Close。` : "此模式不允許自動點擊任何按鈕。"}
6. 點擊後等待 Paper Trading 訂單確認，不得重複點擊。
7. Paper Trading 面板不可見或切換到真實帳戶時：輸出 MANUAL，Reason: 請確認 TradingView Paper Trading 面板已開啟。`;
}

function buildSessionStarterCard() {
  const gate = buildEntryGate();
  const platform = inferPlatform();
  const schedule = state.schedule.useWindow
    ? `限制時段 ${state.schedule.startTime || "??"}–${state.schedule.endTime || "??"}`
    : `每 ${state.schedule.intervalSeconds} 秒`;
  return `你是 ${state.market} ${state.mode} 交易協調者。
平台：${platform}（${state.mode}）。
風控：單筆止損 ${formatMoneyLike(state.risk.stopLoss)}，日損上限 ${formatMoneyLike(state.risk.dailyLoss)}，最低 RR ${state.risk.minimumRR}，最大 ${state.risk.maxContracts} 口。
Entry Gate：setup_score >= ${gate.setupScore}，confidence >= ${gate.confidence}。
執行節奏：${schedule}。
角色團隊：${selectedAgents().map(a => a.shortName || a.name).join("、")}。

開始前先確認：
- 帳戶模式 = ${state.mode.includes("Demo") ? "Demo" : state.mode.includes("Paper") ? "Paper" : state.mode.includes("Replay") ? "Replay" : "已授權模式"}
- 商品 = ${state.market}
- 口數欄位可見
- PnL 可見

確認後輸出第一張 Trading Action Card。`;
}

function buildPromptQuality() {
  const checks = {
    riskManagerSelected: selectedAgents().some(a => a.id === "risk"),
    coreTeamSize: selectedAgents().filter(a => ["risk", "1m", "5m", "trend"].includes(a.id)).length,
    indicatorsSelected: selectedIndicators().length,
    riskConfigured: state.risk.stopLoss > 0 && state.risk.dailyLoss > 0 && state.risk.minimumRR >= 1,
    modeSet: !!state.mode,
    marketSet: !!state.market
  };
  const score = Object.values(checks).filter(Boolean).length +
    (checks.coreTeamSize >= 3 ? 1 : 0) +
    (checks.indicatorsSelected >= 3 ? 1 : 0);
  if (score >= 7) return { grade: "A", label: "完整", note: "所有必要設定齊備，Prompt 品質最佳。" };
  if (score >= 5) return { grade: "B", label: "良好", note: "主要設定完成，可正常使用。建議補齊角色或指標。" };
  return { grade: "C", label: "基本", note: "部分設定尚未完成，建議補充更多指標與角色。" };
}

function buildDebateItems() {
  return [
    { title: "即時交易員", text: "提出可能的短線進場條件，但不能直接下單。" },
    { title: "風控主管", text: "檢查盈虧比、日內風險、最大虧損與是否過度交易；必要時否決。" },
    { title: "關鍵位專家", text: "檢查上方/下方是否有太近的壓力或支撐。" },
    { title: "大方向觀察員", text: "確認大方向是否支持目前想法，避免明顯逆勢。" },
    { title: "最終共識", text: "只有 Decision Engine 可以輸出買進、賣出、等待、出場。" }
  ];
}

function buildPrompt() {
  const agentText = selectedAgents().map(agent => `### ${agent.name} — ${agent.role}
${agent.prompt || `Role: ${agent.role}
Scope: ${agent.duty}
Output: 請輸出簡短內部判斷。
Strict Rule: 不可以決定最終下單，必須服從 Risk Manager 與安全規則。`}`).join("\n\n");
  const indicatorText = selectedIndicators().map(indicator => `- ${indicator.name}（${indicator.role}）：${indicator.hint}`).join("\n");
  const optionalIndicatorText = selectedOptionalIndicators().map(indicator => indicator.name).join(" / ") || "none";
  const requiredIndicatorText = selectedRequiredIndicators().map(indicator => indicator.name).join(" / ") || "none";
  const modeRules = buildModeRules();
  const executionPolicy = buildExecutionPolicy();
  const emergencyPolicy = buildEmergencyPolicy();
  const orchestratorWorkflow = buildOrchestratorWorkflow();
  const failureMessages = buildFailureMessages();
  const entryGate = buildEntryGate();
  return `# 交易自動化設定檔

你是我的交易流程協調者。請依照本設定檔內的三層決策架構與 workflow 執行每一輪交易 heartbeat。顧客只需要 Codex 帳號、Codex in-app browser，以及自己的 TradingView / Tradovate / TradeDay / Paper Trading 網頁登入；不得要求顧客安裝套件、clone repo、執行 Python/npm/CLI 或安裝 broker SDK。

請用清楚、果斷、風控優先的方式，根據以下選項產生自動化交易設定檔、畫面提示規格與測試計畫。Demo / Paper / Replay Auto 的目標是有效測試策略，不要因為輔助資訊不完整而永遠不交易；但超出風控時必須先處理風險。

## 使用者設定
- 市場：${state.market}
- 使用模式：${state.mode}
- 交易人格：${state.personality}
- 目標：${state.goal}
- 風格：${state.style}
- 參考指標：${selectedIndicators().map(indicator => indicator.name).join(" / ")}
- selected_optional_indicators：${optionalIndicatorText}
- selected_required_indicators：${requiredIndicatorText}
- Heartbeat Verbosity：${state.heartbeatVerbosity}
- 每日盈利目標：${formatMoneyLike(state.risk.profitTarget)}
- 單筆最大止損：${formatMoneyLike(state.risk.stopLoss)}
- 每日最大虧損：${formatMoneyLike(state.risk.dailyLoss)}
- 最低盈虧比：${state.risk.minimumRR}
- 最大口數：${state.risk.maxContracts}
- 加碼規則：${state.risk.addOnRule}
- 自動執行間隔秒數：${state.schedule.intervalSeconds}
- 是否限制執行時段：${state.schedule.useWindow ? "是" : "否"}
- 自動執行星期：${state.schedule.useWindow ? formatScheduleDays() : "不限制"}
- 每日自動執行開始時間：${state.schedule.useWindow ? state.schedule.startTime || "不限制" : "不限制"}
- 每日自動執行結束時間：${state.schedule.useWindow ? state.schedule.endTime || "不限制" : "不限制"}
- 自動執行排程摘要：${formatScheduleSummary()}
- 快速組合：${presets.find(preset => preset.id === state.preset)?.label || "Custom"}
- 執行範圍：${modeExecutionScope()}

## Codex-only 使用原則
1. 顧客不需要安裝任何套件、不需要下載 repo、不需要執行本機腳本。
2. 顧客需要自行在 Codex in-app browser 登入交易或圖表平台。
3. Codex 帳號不等於 broker 帳號，也不代表已授權真實資金交易。
4. 所有 Live-ready 或真實資金相關動作都必須人工確認。

${buildPlatformRules()}

## Orchestrator workflow
${orchestratorWorkflow}

## 使用模式規則
${modeRules}

## 三層決策架構
請永遠依照以下三層順序判斷，避免規則互相覆蓋。

### A. 永遠不變的安全層
1. Live / Real 未授權時禁止自動點擊。
2. 帳戶模式、商品、qty、position、orders、Buy / Sell / Close / Exit 不明時，輸出 MANUAL。
3. 每輪最多一個動作；成交狀態不明時不得重複點擊。
4. Risk Manager 有否決權。
5. 這一層永遠高於使用者偏好、策略分數、Agent 觀點與輸出格式。

### B. 使用者設定覆蓋層
使用者 Starter UI 的最新設定為最高有效設定，其中 risk 數值優先於所有 skill 預設；但不得覆蓋 platform-safety 與 authorization-modes。
- 每日盈利目標：${formatMoneyLike(state.risk.profitTarget)}
- 單筆最大止損：${formatMoneyLike(state.risk.stopLoss)}
- 每日最大虧損：${formatMoneyLike(state.risk.dailyLoss)}
- 最低盈虧比：${state.risk.minimumRR}
- 最大口數：${state.risk.maxContracts}
- 加碼規則：${state.risk.addOnRule}

若 Skill 文件、Agent Prompt 或舊記憶中的預設值與以上數值衝突，一律以上方使用者設定為準。

### C. 策略判斷層
1. setup_score、confidence、MACD、RSI、VWAP、Volume、Support / Resistance 與 Agent 分析只屬於策略判斷層。
2. 策略判斷層不能越過安全層或使用者 risk 設定。
3. Compact 模式不輸出完整策略推理，只輸出 Action Card 與最主要原因。

## 自動執行排程
1. 每輪 heartbeat / 自動執行間隔：${state.schedule.intervalSeconds} 秒。
2. 是否限制執行時段：${state.schedule.useWindow ? "是" : "否"}。
3. 自動執行星期：${state.schedule.useWindow ? formatScheduleDays() : "不限制"}。
4. 每日開始時間：${state.schedule.useWindow ? state.schedule.startTime || "不限制" : "不限制"}。
5. 每日結束時間：${state.schedule.useWindow ? state.schedule.endTime || "不限制" : "不限制"}。
6. 若未限制執行時段，依照間隔秒數持續執行，直到使用者停止本流程。
7. 若限制執行時段，只在選定星期與時間窗內執行。
8. 開始/結束時間以本台電腦時區為準，不會自動換算交易所時區。
9. 使用者必須自行換算當地交易所時間；例如美股請以美國交易時段為主，並考慮日光節約時間。
10. 若目前不是選定星期，輸出 WAIT，Reason: 非自動執行日。
11. 若目前時間尚未到開始時間，輸出 WAIT，Reason: 尚未到自動執行時間。
12. 若目前時間已超過結束時間，停止新開倉；若無持倉，輸出 WAIT，Reason: 已超過自動執行時間。
13. 若超過結束時間但仍有持倉，只允許依風控管理既有部位，不允許新開倉或加碼。
14. 不要要求使用者安裝 cron、套件、broker SDK 或 API；這只是給 Codex heartbeat / 自動化排程使用的設定。

## Dynamic Entry Gate
本輪 Entry Gate 類型：${entryGate.label}
- setup_score >= ${entryGate.setupScore}
- confidence >= ${entryGate.confidence}
- RR >= ${state.risk.minimumRR}
- stop <= ${formatMoneyLike(state.risk.stopLoss)}
- qty <= ${state.risk.maxContracts}
- position = 0
- working orders 必須是 no dangerous or conflicting working orders

Entry Gate 選擇規則：
1. 只有當「風格=進攻」且「快速組合=Scalper」時，才使用 Aggressive Entry Gate。
2. 若風格=保守，最低使用 Balanced Gate；即使目標是「快速進場」或交易人格是 Swing Trader，也不得自動升級成 Aggressive。
3. Conservative Swing with Fast Entry 不等於 Aggressive Scalper；它使用 Balanced floor for Conservative。
4. 其他平衡、Hybrid 或一般情境使用 Balanced Gate。
5. 不得固定使用 setup_score >= 72 或 confidence >= 68。

## 安全判斷分層
請把資訊不足分成「硬阻擋」與「軟降分」，避免因輔助資訊缺少而永遠無法測試。

硬阻擋條件：
1. 畫面顯示 Real / Live / 真實帳戶，但使用模式不是已明確授權的 Live Auto。
2. 使用模式是 Live View，或 Live Approve 尚未確認，卻需要點擊 Buy / Sell / Close / Exit / Cancel / Replace。
3. 商品不是使用者設定市場，或無法確認目前交易商品。
4. qty 超過最大口數 ${state.risk.maxContracts}，或 qty 不可見且準備下單。
5. 實際持倉不明，且無法確認 Position / Orders / Working Orders。
6. Real / Live 模式下 daily PnL 不可見且準備下單。
7. 已有持倉時，open position PnL 不可見且需要管理部位。
8. 已有持倉時，Position / Orders / Working Orders 不清楚。
9. 需要平倉、減倉、Cancel / Replace，但無法確認部位與掛單狀態。
10. Buy / Sell / Close / Exit 按鈕不可見，卻需要執行交易動作。
11. entry、stop、take profit、失效條件無法形成完整候選 setup。
12. 候選 setup 的 RR < ${state.risk.minimumRR}，或單筆止損超過 ${formatMoneyLike(state.risk.stopLoss)}。

軟降分條件：
1. MACD / RSI / VWAP / KDJ / Volume / News / Macro 不可見。
2. 5m / 1h 結構不可見，但 1m 價格結構、關鍵價位與風控仍清楚。
3. daily PnL 不可見，但使用模式是 Demo Auto / Paper Auto / Replay Auto、position = 0、其他核心安全條件完整，且沒有 dangerous or conflicting working orders。
4. 畫面只有部分輔助指標，或指標互相衝突。
5. News / Macro 不可見時標註 unknown；不可捏造事件或跨市場資料。

軟降分處理：
1. 不可假造不可見資料。
2. 必須在風險段落標註不可見資訊。
3. daily PnL 不可見時，confidence 降低 3 到 8 分。
4. 輔助指標不可見時，只降低 confidence 或 setup_score。
5. 但不得只因輔助指標不可見就直接阻擋 Demo / Paper / Replay 測試。
6. 只有 selected_required_indicators 不可見時，才允許 MANUAL；selected_optional_indicators 不可見只能降分。

## 顧客修復提示
當畫面不安全或資訊不足時，請使用以下短句，不要輸出長篇規則：
${failureMessages}

## 部位與帳戶判讀優先順序
1. 實際部位以交易面板 Position、Orders/Positions 面板的 open position、avg price、working orders 為主。
2. Market Analyzer 或商品列表中的數字不得單獨視為持倉。
3. 若商品列表顯示數字但交易面板 Position = 0，請標註「可能是列表/報價欄位，不等於持倉」，不得因此直接判定已有部位。
4. 若 Position 與 Orders/Positions 面板衝突，才視為硬阻擋並要求人工確認。

## 內部候選 Setup
系統內部每輪必須整理一組或多組候選 setup；即使最終建議是等待，也必須知道主要卡點：
1. direction：買進 / 賣出 / 等待。
2. entry：候選進場價或觸發條件。
3. stop：候選止損位置。
4. take_profit：候選盈利目標。
5. invalidation：失效條件。
6. rr：用候選 entry、stop、take_profit 計算 RR。
7. setup_score 與 confidence：說明加分與扣分來源。

如果候選 setup 無法達到最低 RR 或風控門檻，內部標記「候選不合格」；不要只輸出 RR 不可計算。
Compact 模式不輸出完整 setup，只在 WAIT Reason 中輸出最主要未通過原因。
Review 模式才展開候選 setup 與 Agent 分析。

## WAIT 卡住原因
Compact 模式允許 WAIT 帶一個最短卡住原因，但不能變成長篇分析。
如果有候選 setup 但沒有通過門檻，Reason 必須指出最主要卡點，例如：
- 候選不合格：confidence 61 < ${entryGate.confidence}
- 候選不合格：setup_score 63 < ${entryGate.setupScore}
- 候選不合格：RR 1.2 < ${state.risk.minimumRR}
- 候選不合格：stop 1,700 > ${formatMoneyLike(state.risk.stopLoss)}
- 等待回踩確認
- 價格離進場區太遠
- 方向分歧過大
- 風控阻擋
- 加碼不合格：未到 add zone
- 加碼不合格：加碼後風險超標

只有完全沒有候選 setup 時，才輸出：
Action: WAIT
Reason: 無有效進場訊號

## Working Orders 規則
New Entry Mode 不要求完全沒有 working orders；要求 no dangerous or conflicting working orders。
不阻擋：
1. working orders 明確為 inactive。
2. working orders 明確已 cancelled。
3. working orders 與目前商品無關。
4. working orders 明確不會影響新交易。
5. Orders panel 顯示沒有 active working order。
6. Orders panel 不可見，但交易面板明確顯示 position = 0 且 active orders = 0 或 no working orders。

阻擋或 MANUAL：
1. 完全看不到 Orders / Position / Working Orders 任一資訊，且平台可能存在掛單。
2. working orders 與新方向衝突。
3. working orders 口數不明。
4. working orders 商品不明。
5. working orders 可能造成重複進場。
6. 之前點擊後 fill status 不明。

若 working orders 不明，輸出：
Action: MANUAL
Reason: 掛單狀態不明
Next: 請確認 Working Orders 是否仍有效

## 執行政策
${executionPolicy}

## Emergency Risk Mode
${emergencyPolicy}

## 交易角色團隊
${agentText}

## 參考指標
${indicatorText}

## 請產生的內容
1. 交易設定檔：包含角色、限制、流程、輸出格式與安全規則。
2. 畫面提示規格：說明畫面要如何顯示建議買進、建議賣出、觀察中、等待確認、風險過高與不建議交易。
3. 訊號邏輯：描述什麼情況可以提出 Buy / Sell / Watch，但交易角色不可直接下單。
4. 風控與出場規格：包含止損、盈利目標、最低盈虧比、最大口數與加碼規則。
5. 測試計畫：優先使用 Replay / Demo / Paper Trading，驗證設定檔與畫面提示是否一致。

## 指標顯示需求
1. 指標應該用新手看得懂的文字顯示，不要一開始要求使用者理解複雜技術名詞。
2. 圖上可顯示：建議買進、建議賣出、觀察中、等待確認、風險過高、不建議交易。
3. 若有正式訊號，必須同時顯示進場理由、止損位置、盈利目標、最低盈虧比與風險提醒。
4. 若條件不足，應優先顯示等待或觀察，不要過度產生訊號。
5. 指標只做決策輔助，不代表真實帳戶自動下單授權。
6. 參考指標只能作為證據來源。不得因 MACD、RSI、VWAP、KDJ 或任何單一指標出現訊號，就直接輸出買進或賣出。
7. 若多個指標互相衝突，請降低信心並要求交易角色說明分歧。

## 交易角色工作規則
1. 交易角色只能提供觀察、支持理由、反對理由、最大風險、關鍵價位與失效條件。
2. 交易角色不允許直接輸出「立刻買進」或「立刻賣出」。
3. Risk Manager 擁有否決權。若硬阻擋條件成立、RR 不足、風險過高、接近重大新聞或核心安全資訊不清楚，必須阻擋新進場；若已進入 Emergency Risk Mode，Risk Manager 可以要求出場、減倉或取消不匹配掛單。
4. Compact / Auto 模式只需要 Risk Manager 檢查，並至少一個非同向 Agent 提出風險檢查；如果沒有重大衝突，不要為了湊反方觀點而降低 confidence。
5. Review 模式才要求至少三位交易角色提出反方觀點或風險提醒。
6. 只有 Decision Engine 可以輸出最終狀態：買進、賣出、等待、持有、減倉、出場。

## 風險邊界
1. 若單筆預估止損超過 ${formatMoneyLike(state.risk.stopLoss)}，Risk Manager 必須阻擋。
2. 若當日虧損接近或達到 ${formatMoneyLike(state.risk.dailyLoss)}，停止尋找新交易。
3. 若當日盈利達到 ${formatMoneyLike(state.risk.profitTarget)}，停止主動開新倉，優先回顧與保護獲利。
4. 任何交易的最低盈虧比必須 >= ${state.risk.minimumRR}。
5. 最大口數不得超過 ${state.risk.maxContracts}。
6. 加碼規則：${state.risk.addOnRule}。

## 本輪加碼政策
${buildAddOnPolicy()}

## 電腦操作規則
1. 每次準備操作畫面前，先用一句話通知目前觀察與下一步。
2. 若帳戶模式、商品、qty、Buy/Sell/Close/Exit 按鈕不可見，停止操作並要求人工確認。
3. 若看到 Real / Live / 真實帳戶，立即停止，不點擊任何交易按鈕。
4. 每輪最多一個動作。成交狀態不明時，不重複點擊。
5. 若角色觀點衝突、風險過高、接近重大新聞或交易理由不足，禁止新進場；若已有持倉且觸發 Emergency Risk Mode，優先處理風險，不要只輸出等待。
6. 必須遵守使用模式規則；若平台畫面與所選模式不一致，立即停止並要求人工確認。

## 輸出精簡規則
${buildOutputRules()}

## 每輪輸出格式
請使用中文短版 Trading Action Card。Compact / Normal 不要增加其他段落；Review 模式可先列 Agent review，但最後仍必須輸出 Action Card。

若沒有交易機會，只輸出：

Action: WAIT
Reason: 無有效進場訊號

若無法確認帳戶環境、商品、口數、目前倉位、PnL、Buy / Sell / Close 按鈕或 Live 授權，只輸出：

Action: MANUAL
Reason: 無法確認安全條件
Next: 請確認交易畫面、帳戶模式、商品、口數與目前倉位

若可以下單，只輸出：

Action: 多單 / 空單
Volume: 1 lot
Entry: Market
TP: 4650.5
SL: 4590
Confidence: 75%
Reason: MACD 黃金交叉，RSI < 20，價格上穿均線。

若要處理既有部位，只輸出：

Action: 平倉 / 減倉
Volume: All / 1 lot
Reason: 一句話說明 thesis 失效、風險升高或需要降低部位。

請保持語氣溫和、具體、可執行，不要誇大勝率，也不要把任何建議當成真實帳戶自動交易授權。`;
}

function buildOrchestratorWorkflow() {
  return `每輪 heartbeat 必須依序執行，不得跳步：
1. Master Policy Agent：套用 Skill 優先級；Starter UI 最新設定優先於預設參數，但不能覆蓋安全與風控。
2. Safety Agent：確認平台、帳戶模式、商品、qty、position、PnL、Buy/Sell/Close、working orders、上一輪 fill status。
3. Authorization Agent：依使用模式判斷 Demo Auto、Paper Auto、Replay Auto、Live View、Live Approve、Live Auto 是否允許操作。
4. Market Scan Agent：讀取可見 K 線、VWAP/MA、MACD、RSI、Volume、支撐壓力，產生候選 setup；不得授權下單。
5. Risk Manager Agent：檢查日損、日利、單筆止損、RR、最大口數、加碼規則；可否決任何新進場。
6. TP/SL Agent：輸出 entry、SL、TP、RR、invalidation、reduce_zone、breakeven_rule。
7. Position Manager Agent：先管理既有部位，再考慮新進場；position 不清楚時不得加碼。
8. Execution Agent：只有前面全部通過時，才可依授權模式每輪最多點擊一次。
9. Heartbeat Reporter Agent：最後只輸出中文 Trading Action Card；沒有機會輸出 WAIT，看不清楚或未授權輸出 MANUAL。

權限邊界：
- Market Scan 只能分析，不能授權。
- Execution 不能覆蓋 Safety、Authorization 或 Risk Manager。
- Risk Manager 擁有否決權。
- Real / Live / 帳戶模式不明，或 Live 未明確授權時，禁止自動點擊。`;
}

function buildFailureMessages() {
  return `- 帳戶模式不明：帳戶模式無法確認，暫停自動操作。請確認畫面是 Demo、Replay 或 Paper Trading。
- Real / Live：畫面出現 Real / Live / 真實帳戶，禁止自動點擊。
- 商品不明：商品無法確認為 ${state.market || "指定市場"}，暫停。
- qty 不可見：qty 不可見，不能安全確認下單口數。
- PnL 不可見：PnL 不可見，不能確認日內風險狀態。
- Close / Exit 不可見：Close / Exit 控制不可見，不能安全管理部位。
- 成交不明：上一個點擊成交狀態不明，禁止重複點擊。
- 掛單不明：Working orders 狀態不明，請人工確認是否有危險掛單。`;
}

function modeExecutionScope() {
  if (state.mode === "Demo Auto") return "Demo 環境自動測試；安全、授權、風控與訊號全部通過後才可自動執行。";
  if (state.mode === "Paper Auto") return "Paper Trading 自動測試；安全、授權、風控與訊號全部通過後才可自動執行。";
  if (state.mode === "Replay Auto") return "Replay 自動測試；安全、授權、風控與訊號全部通過後才可自動執行。";
  if (state.mode === "Live View") return "Live 只讀分析；不得操作交易按鈕或修改訂單。";
  if (state.mode === "Live Approve") return "Live 建議模式；每次交易動作必須等待使用者確認。";
  if (state.mode === "Live Auto") return "Live 自動模式；只有使用者明確選擇並確認風險後才允許自動下單。";
  return "尚未設定";
}

function buildModeRules() {
  if (state.mode === "Demo Auto") {
    return `1. 只有畫面明確是 Demo，且安全、授權、風控、策略訊號全部通過時，才允許自動點擊。
2. 若看不到帳戶模式、商品、口數、目前倉位、PnL、Buy / Sell / Close 按鈕，輸出 MANUAL。
3. 若畫面顯示 Real、Live、真實帳戶或帳戶模式不明，立即停止。`;
  }
  if (state.mode === "Paper Auto") {
    return `1. 只有畫面明確是 Paper Trading，且安全、授權、風控、策略訊號全部通過時，才允許自動點擊。
2. Paper Trading 不等於真實帳戶授權；若平台狀態不清楚，輸出 MANUAL。
3. 每輪最多一個動作，成交狀態不明時不得重複點擊。`;
  }
  if (state.mode === "Replay Auto") {
    return `1. 只要畫面明確是 Replay / Simulated / Paper / Demo，且不是未授權 Real / Live，就可進入自動執行判斷。
2. Replay 暫停、商品不明、部位不明或下單按鈕不可見時，輸出 MANUAL。
3. daily PnL 不可見只降分，不直接阻擋 position = 0 的新候選 setup。
4. 輔助指標不可見只降分；指標互相衝突只降 confidence。
5. 只有核心安全資訊不明才 MANUAL。`;
  }
  if (state.mode === "Live View") {
    return `1. 只能看盤與分析，不允許下單。
2. 禁止點擊 Buy、Sell、Close、Exit、Cancel、Replace 或任何會改變訂單/部位的按鈕。
3. 即使 setup 合格，也只能輸出分析或 WAIT / MANUAL。`;
  }
  if (state.mode === "Live Approve") {
    return `1. 可以提出交易建議，但必須等待使用者確認。
2. 未取得確認前，不允許自動點擊 Buy / Sell / Close / Exit / Cancel / Replace。
3. 若帳戶、商品、口數、部位、PnL、停損或止盈任一不清楚，輸出 MANUAL。`;
  }
  if (state.mode === "Live Auto") {
    return `1. 只有使用者明確選擇 Live Auto，並確認風險後，才允許自動下單。
2. Live Auto 仍必須通過 platform-safety、authorization-modes、risk-control、market-scan 與 order-execution。
3. 任一安全、授權或風控條件不清楚，輸出 MANUAL，不得自動點擊。`;
  }
  return "1. 尚未選擇使用模式。";
}

function buildExecutionPolicy() {
  const gate = buildEntryGate();
  if (["Live View", "Live Approve"].includes(state.mode)) {
    return `1. execution_allowed=false，除非 Live Approve 已收到使用者對單一具體動作的確認。
2. 可以產生候選 setup、RR、風險與 Action Card。
3. 未確認前不得點擊任何交易、訂單或部位管理按鈕。`;
  }
  if (["Demo Auto", "Paper Auto", "Replay Auto"].includes(state.mode)) {
    return `1. 若畫面明確符合 ${state.mode}，允許進入自動執行判斷；請先判斷目前是 New Entry Mode 還是 Emergency Risk Mode。
2. daily PnL 不可見時，不要直接阻擋 position = 0 的候選 setup；請標註 daily PnL 不可見，並把 confidence 降低 3 到 8 分。
3. 若 daily PnL 不可見但 position = 0、核心安全條件完整、且沒有 dangerous or conflicting working orders，可以在 Demo / Paper / Replay 中用「daily PnL 未知，按 0 暫估」產生候選並允許自動執行。
4. 輔助指標不可見只降分，不是硬阻擋。
5. New Entry Mode：只有當 position = 0、no dangerous or conflicting working orders、qty <= ${state.risk.maxContracts}、候選 setup_score >= ${gate.setupScore}、confidence >= ${gate.confidence}、RR >= ${state.risk.minimumRR}、stop <= ${formatMoneyLike(state.risk.stopLoss)}，才允許新進場。
6. Emergency Risk Mode：若已有持倉，不再套用 position = 0 條件；改用 Emergency Risk Mode 規則，允許 Exit / Reduce / Cancel 不匹配掛單，禁止新增 Buy / Sell 加碼。
7. 計畫型加碼不是 Emergency Risk Mode；只有非計畫型加碼、突破 total invalidation、超口數或超風險才進入 Emergency Risk Mode。
8. 若 position = 0 且商品列表出現數字，不得單獨視為持倉；請依部位判讀優先順序確認。
9. Replay Auto 專用：只要畫面明確是 Replay / Simulated / Paper / Demo 且不是未授權 Live，就可進入自動執行判斷；daily PnL 不可見只降分，核心安全資訊不明才 MANUAL。`;
  }
  if (state.mode === "Live Auto") {
    return `1. Live Auto 只有在使用者明確選擇並確認風險後才可進入自動執行判斷。
2. 帳戶模式、商品、qty、position、PnL、Buy / Sell / Close、SL、TP、RR 任一不清楚，必須輸出 MANUAL。
3. 輔助指標不可見只能降低 confidence，不能補造資料。
4. New Entry Mode：只有當 position = 0、no dangerous or conflicting working orders、qty <= ${state.risk.maxContracts}、setup_score >= ${gate.setupScore}、confidence >= ${gate.confidence}、RR >= ${state.risk.minimumRR}、stop <= ${formatMoneyLike(state.risk.stopLoss)}，才允許新進場。
5. 每輪最多一個動作；成交狀態不明時停止所有後續點擊並輸出 MANUAL。`;
  }
  return "1. 尚未選擇使用模式，execution_allowed=false。";
}

function buildEmergencyPolicy() {
  const gate = buildEntryGate();
  if (["Live View", "Live Approve"].includes(state.mode)) {
    return `1. ${state.mode} 只能標記緊急風控狀態，不得自動點擊 Exit、Close、Cancel、Reduce 或任何交易按鈕。
2. 若發現浮虧超限、口數超限、沒有 stop 或掛單不匹配，必須輸出 MANUAL，要求人工立即處理。`;
  }
  if (["Demo Auto", "Paper Auto", "Replay Auto", "Live Auto"].includes(state.mode)) {
    return `1. Emergency Risk Mode 的優先權高於 New Entry Mode；它不是新交易，而是風控處理。
2. 只要出現以下任一情況，立即進入 Emergency Risk Mode：
   - open P/L 或部位浮虧超過單筆最大止損 ${formatMoneyLike(state.risk.stopLoss)}。
   - position 絕對值超過最大口數 ${state.risk.maxContracts}。
   - 已有持倉但沒有有效 stop。
   - working stop / limit / bracket 與目前持倉方向或口數不匹配。
   - 價格已觸發失效條件，但部位仍未出場。
   - 出現非計畫型加碼、重複進場或未授權同方向新增部位。
3. Emergency Risk Mode 允許的動作：
   - Exit at Mkt & Cxl：當浮虧超限、沒有有效 stop、口數超限或掛單混亂時優先使用。
   - Reduce：當平台可明確減倉且能把口數降回 ${state.risk.maxContracts} 以下時使用。
   - Cancel / Replace：只用於取消不匹配或危險的 working orders；不得用來放寬風控。
4. Emergency Risk Mode 禁止動作：
   - 不得新增同方向 Buy / Sell 加碼。
   - 不得移遠 stop。
   - 不得為了等待反彈而忽略超損或超口數。
5. ${allowsAddOn() ? `計畫型加碼允許條件：
   - 使用者設定允許加碼，且不是「不允許加碼」。
   - 原交易 thesis 尚未失效。
   - 價格到達使用者設定或系統候選 add zone。
   - 加碼後總口數 <= ${state.risk.maxContracts}。
   - 加碼後總風險仍 <= ${formatMoneyLike(state.risk.stopLoss)}。
   - 加碼後 RR >= ${state.risk.minimumRR}。
   - position 與 working orders 明確。
   - 不是 Real / Live 未授權環境。
   - confidence >= ${gate.addConfidence}。` : `本輪加碼規則為「不允許加碼」：所有 Add-on / Scale-in / DCA / Averaging down 一律禁止；已有持倉時只允許持有、減倉、平倉或風控處理。`}
6. ${allowsAddOn() ? `必須阻擋的加碼：
   - thesis 已失效或突破 total invalidation。
   - 加碼後總口數超過最大口數。
   - 加碼後總風險超過單筆最大止損。
   - 加碼只是因為虧損，沒有到達 add zone。
   - working orders 不明、position 不明或 Live Auto 未授權。
7. 若加碼不合格，輸出最短 WAIT 原因，例如「加碼不合格：未到 add zone」或「加碼不合格：加碼後風險超標」。` : `若系統偵測任何新增同方向部位意圖，輸出 WAIT，Reason: 本輪設定不允許加碼。`}
8. 若 Exit at Mkt & Cxl 按鈕清楚可見、商品與部位明確、帳戶與授權符合 ${state.mode}、且風控已被觸發，execution_allowed=true；每輪最多點擊一次，點擊後必須檢查成交或部位是否歸零。
9. 若 bracket / working orders 狀態不清楚，但 Exit at Mkt & Cxl 明確表示會取消掛單並平倉，可優先使用 Exit at Mkt & Cxl 處理超風控狀態。
10. 若帳戶模式不明、商品不明、Exit 不可見、或平台顯示未授權 Live，execution_allowed=false，輸出 MANUAL 要求人工處理。`;
  }
  return "1. 尚未選擇使用模式，Emergency Risk Mode 不允許自動操作。";
}

function buildOutputRules() {
  const gate = buildEntryGate();
  const reviewRule = state.heartbeatVerbosity === "Review"
    ? "Review 模式允許輸出 1m Agent、5m Agent、Indicator Agent、Support / Resistance Agent、Risk Manager、Final Decision。"
    : "不要輸出完整 Agent 討論；只有使用者明確要求展開原因時，才允許完整 Agent 分析。";
  const normalRule = state.heartbeatVerbosity === "Normal"
    ? "Normal 模式可以稍微多一點說明，但仍不能輸出完整 Agent 討論或長篇市場分析。"
    : "Compact 模式只輸出最短交易指令。";
  return `1. 預設使用中文短版 Trading Action Card。
2. Action 只能是：多單、空單、平倉、減倉、WAIT、MANUAL。
3. ${normalRule}
4. ${reviewRule}
5. 不要輸出長篇市場分析、完整策略規則、風控規則、Skill 內容或角色職責。
6. 只有 Action 是「多單、空單、平倉、減倉」時，才輸出完整交易欄位。
7. 如果沒有交易機會，輸出 WAIT；若有候選 setup，Reason 必須指出最短卡住原因。
8. 如果看不到帳戶環境、商品、口數、目前倉位、PnL、Buy / Sell / Close 按鈕，或無法確認授權，只輸出 MANUAL。
9. WAIT 輸出低於 50 tokens；MANUAL 輸出低於 80 tokens；下單 Action Card 低於 150 tokens。
10. 如果 Action 是多單或空單，必須包含 Volume、Entry、TP、SL、Confidence、Reason。
11. 如果 Action 是平倉或減倉，必須包含 Volume、Reason。
12. WAIT Reason 範例：候選不合格：confidence 61 < ${gate.confidence} / setup_score 63 < ${gate.setupScore} / RR 1.2 < ${state.risk.minimumRR} / stop 1,700 > ${formatMoneyLike(state.risk.stopLoss)} / 等待回踩確認 / 價格離進場區太遠 / 方向分歧過大 / 風控阻擋。
13. 預設輸出純文字 Action Card。若需要機器可讀格式（如記錄到 run log），可輸出以下 XML 格式後再附上純文字卡：
<action><type>多單|空單|平倉|減倉|WAIT|MANUAL</type><volume>n</volume><entry>price</entry><tp>price</tp><sl>price</sl><confidence>0-100</confidence><reason>≤30字</reason></action>
14. 沒有明確要求時，只輸出純文字 Action Card，不要額外附 XML。`;
}

function flashButton(button, text) {
  const original = button.textContent;
  button.textContent = text;
  setTimeout(() => {
    button.textContent = original;
  }, 1200);
}

init();
