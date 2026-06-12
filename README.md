# AI-Trading

AI-Trading 是一套 **Codex-only、零安裝** 的 AI 交易 Prompt Starter 與 Skill 規格。目標是讓顧客只需要 Codex 帳號、Codex in-app browser，以及自己的交易平台網頁登入，就能用 AI 進行 Demo、Replay 或 Paper Trading 工作流。

顧客不需要安裝 Python、npm、broker SDK、瀏覽器擴充套件，也不需要 clone 這個 repo。

> Codex 帳號不等於 broker 帳號，也不代表已授權真實資金交易。本專案預設只用於 Demo、Replay、Paper Trading；Real / Live 相關動作必須人工確認。

## 核心定位

- **Starter**：用 7 個步驟產生可貼進 Codex 的 trading prompt。
- **Orchestrator Skill**：固定每輪 heartbeat 的安全檢查、授權、行情掃描、風控、TP/SL、部位管理、執行與回報順序。
- **Safety-first Workflow**：任何 Real / Live / 帳戶模式不明 / qty 不明 / PnL 不明 / Close/Exit 不可見，都必須 fail closed。
- **Short Trading Card Output**：最終輸出以短版交易卡為主，完整設定檔可展開查看或複製。

## 顧客如何使用

1. 開啟 Codex。
2. 在 Codex in-app browser 開啟 TradingView、Tradovate、TradeDay 或支援的 Paper Trading 頁面。
3. 使用 Starter 產生 Codex-ready prompt。
4. 確認交易畫面是 Demo、Replay 或 Paper Trading。
5. 將 prompt 貼到 Codex，讓 Codex 依照 orchestrator workflow 分析、風控、等待或在允許模式下執行 Demo 操作。

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

## 開發者快速開始

這段只給維護本專案的人使用。顧客不需要執行這些步驟。

直接開啟：

```bash
open index.html
```

或啟動本機靜態伺服器：

```bash
python3 -m http.server 8080
```

然後開啟：

```text
http://localhost:8080
```

## 安全原則

- 預設只使用 Demo、Replay 或 Paper Trading。
- 不把 Real / Live 帳戶當成自動點擊測試環境。
- Codex 無法確認帳戶模式、商品、qty、position、PnL、Close/Exit 或成交狀態時，必須等待或要求人工介入。
- 每輪 heartbeat 最多一個動作。
- 無法確認成交時，不得重複點擊。
- README、Skill、docs 不應提交個人路徑、thread id、帳戶資訊、API key、token 或 broker 密碼。

## Orchestrator Workflow

每輪 heartbeat 建議先使用 [skills/mnq-demo-trading-orchestrator/SKILL.md](./skills/mnq-demo-trading-orchestrator/SKILL.md) 作為入口。

固定順序：

```text
platform-safety
-> authorization-modes
-> market-scan
-> risk-control
-> take-profit-stop-loss
-> position-management
-> order-execution
-> heartbeat-reporting
```

權限邊界：

- Market Scan 只能分析，不能授權下單。
- Execution 不能覆蓋 Safety、Authorization 或 Risk Manager。
- Risk Manager 擁有否決權。
- Real / Live / 帳戶模式不明時，禁止自動點擊。

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
- [Roadmap](./docs/roadmap.md)：30 / 60 / 90 天實作節奏。
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

## 目前狀態

已完成：

- Codex-only Starter 首頁文案。
- 7 步設定流程。
- 第 7 步後顯示 Prompt / 交易設定摘要結果區。
- Orchestrator skill。
- Run log 安全規範。
- HKUDS/AI-Trader 參考分析。
- 初版 QA report。

下一步建議：

- 用真實 Demo / Replay / Paper Trading 畫面測 Codex in-app browser 行為。
- 把 Starter 部署成公開靜態頁。
- 補充每種模式的範例 prompt：Read-Only、Demo、Replay、Paper、Live-ready。

