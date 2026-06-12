# Auto-Trading-Prompt-Generator

Auto-Trading-Prompt-Generator是一套 **零安裝** 的 AI 交易 Prompt Starter 。目標是讓顧客只需要 ChatGPT & Codex 加上一個網頁端交易的平台，就可以讓AI 設定定時，自動的操作，不需要額外安裝任何工具 或Skill．

很簡單，透過UI 找到你的交易策略，然後設定多Agent 監管， **請務必確保 Token充足** 在全部交易期間可以流暢地讓AI接管你的交易介面，並且留下紀錄．


## 核心定位

- **Starter**：用 7 個步驟產生可貼進 AI 的 trading prompt。
- **Skill**：根據Promt 嚴格執行，固定每輪 heartbeat 的安全檢查、授權、行情掃描、風控、TP/SL、部位管理、執行與回報順序。
- **Safety-first Workflow**：任何不明確或勝率不高的地方給出建議，不要瞎忙瞎虧錢，只有有把握的訂單才進場。
- **Short Trading Card Output**：最終輸出以短版交易卡為主，完整設定檔可展開查看或複製。

## 顧客如何使用

1. 產生提示詞，貼到AI工具中，以下為Codex為範例
2. 在 Codex in-app browser 開啟 TradingView／Tradovate／TradeDay／Binance 交易介面。
3. 跟你的ＡＩ確定自動化流程多久會看一次？權限設定？是否需要審核？
4. 交易後留下自我評判，看後續如何改進
5. 讓AI去批評之前的交易策略，並自我改進，進入下一輪的市場

## Starter 流程

Starter 目前是靜態網頁，入口是 [index.html](./index.html)。

7 個設定步驟：

1. 選擇市場。
2. 選擇使用模式。
3. 選擇交易人格。
4. 設定目標與風格。
5. 選擇參考指標。
6. 設定風控邊界。
7. 建立交易角色團隊。

第 7 步按下 `產生設定檔` 後，結果區會顯示：

- 左側：`Prompt`、短版交易卡、展開完整設定檔、複製與下載。
- 右側：`你的交易設定已建立`、策略摘要、角色分歧、風控與決策邏輯。
- 下方：視覺預覽。


## 安全原則

- 預設只使用 Demo、Replay 或 Paper Trading，請自行評估是否要進行 真倉交易。
- 止盈止損嚴格依照風控要求。
- 每輪 heartbeat 最多一個動作。
- 無法確認成交時，不得重複點擊。


## Skill 清單

| Skill | 職責 |
| --- | --- |
| [mnq-demo-trading-orchestrator](./skills/mnq-demo-trading-orchestrator/SKILL.md) | 每輪 heartbeat 的總入口與 agent handoff contract |
| [platform-safety](./skills/platform-safety/SKILL.md) | 確認平台、帳戶模式、商品、PnL、qty、position 與控制按鈕 |
| [authorization-modes](./skills/authorization-modes/SKILL.md) | 控制 Read-Only、Demo、Live-ready 等授權邊界 |
| [market-scan](./skills/market-scan/SKILL.md) | 掃描趨勢、VWAP/MA、MACD、RSI、Volume、支撐壓力 |
| [risk-control](./skills/risk-control/SKILL.md) | 檢查日損、日利、RR、最大口數、加碼與停手機制 |
| [take-profit-stop-loss](./skills/take-profit-stop-loss/SKILL.md) | 定義 entry、manual stop、take profit、RR 與 invalidation |
| [position-management](./skills/position-management/SKILL.md) | 管理既有部位：Hold、Add、Reduce、Close |
| [order-execution](./skills/order-execution/SKILL.md) | 在安全與授權通過後，處理 Demo/Paper 點擊規則 |
| [heartbeat-reporting](./skills/heartbeat-reporting/SKILL.md) | 產生最終 heartbeat XML、NOTIFY / DONT_NOTIFY |

## 專案結構

```text
AI-Trading/
├── README.md
├── index.html
├── assets/
│   ├── css/index.css
│   └── js/index.js
├── indicators/
│   └── mnq-aggressive-risk-signal.js
├── skills/
│   ├── mnq-demo-trading-orchestrator/
│   ├── platform-safety/
│   ├── authorization-modes/
│   ├── market-scan/
│   ├── risk-control/
│   ├── take-profit-stop-loss/
│   ├── position-management/
│   ├── order-execution/
│   └── heartbeat-reporting/
├── docs/
│   ├── codex-only-product-direction.md
│   ├── ai-trader-reference-analysis.md
│   ├── multi-agent-prompts-and-implementation.md
│   ├── roadmap.md
│   ├── qa-report-codex-only.md
│   ├── trade-journal.md
│   └── api/demo-trading-run.schema.json
├── runs/
│   └── README.md
├── artifacts/
└── Example/
```

## 文件索引

- [Codex-only product direction](./docs/codex-only-product-direction.md)：產品方向與零安裝原則。
- [HKUDS AI-Trader reference analysis](./docs/ai-trader-reference-analysis.md)：參考專案可學習處與不應複製處。
- [Multi-agent prompts and implementation targets](./docs/multi-agent-prompts-and-implementation.md)：多 agent prompts 與可實作 backlog。
- [QA report](./docs/qa-report-codex-only.md)：Codex-only starter 的 QA 紀錄。
- [Run log schema](./docs/api/demo-trading-run.schema.json)：單輪 heartbeat 的內部結構化 contract。
- [Trading run logs](./runs/README.md)：run log 與 screenshot 的安全保存規範。

## Run Logs 與資料安全

實際 run logs 和 screenshots 可能包含帳戶模式、PnL、部位、時間戳或 broker UI 細節，因此預設不提交。

允許提交：

- schema
- README
- 使用假資料的 redacted example

禁止提交：

- 真實交易截圖
- broker 帳號識別資訊
- API key、token、session、密碼
- 顧客個資
- 私人 PnL 或部位紀錄

