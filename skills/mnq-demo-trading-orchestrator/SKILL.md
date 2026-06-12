---
name: mnq-demo-trading-orchestrator
description: Orchestrate one safe MNQ/MNQM6 Demo, Replay, or Paper Trading heartbeat round. Use when Codex must run the full trading workflow in order, combine platform safety, authorization, market scan, risk, TP/SL, position management, execution, and final heartbeat reporting without skipping guardrails.
---

# MNQ Demo Trading Orchestrator

## Purpose

Use this skill as the top-level workflow controller for one MNQ/MNQM6 heartbeat round. It does not replace the specialized skills. It decides the required order and fail-closed handoff between them.

## Required Skill Order

Run every heartbeat round in this order:

1. `platform-safety`
2. `authorization-modes`
3. `market-scan`
4. `risk-control`
5. `take-profit-stop-loss`
6. `position-management`
7. `order-execution`
8. `heartbeat-reporting`

Do not skip earlier skills because a later setup looks attractive. A valid market setup is not execution permission.

## Agent Handoff Contract

| Agent | Responsibility | Allowed Actions | Prohibited Actions | Required Outputs |
| --- | --- | --- | --- | --- |
| Safety Agent | Verify platform, account mode, symbol, controls, PnL, qty, position, working orders, and prior fill status. | Mark execution allowed or blocked. Identify unsafe screen state. | Never interpret a trade setup. Never authorize a click when account mode is unclear. | `platform`, `account_mode`, `live_risk_detected`, `symbol_confirmed`, `controls_visible`, `close_exit_visible`, `qty_status`, `pnl_visible`, `working_orders_status`, `execution_allowed`, `safety_reason` |
| Authorization Agent | Match the visible environment to the selected mode. | Confirm `read_only`, `demo_auto_execute`, or `live_ready_manual_confirm`. | Never convert Live-ready into auto-execute permission. | `authorization_mode`, `allowed_actions`, `blocked_actions`, `manual_confirmation_required` |
| Market Scan Agent | Read visible chart context and produce candidate setups. | Score Buy/Sell/Wait candidates. Lower confidence for missing indicators. | Never authorize execution. Never invent hidden indicator values. | `trend`, `visible_indicators`, `not_visible_indicators`, `support`, `resistance`, `direction`, `setup_score`, `confidence`, `next_trigger` |
| Risk Manager Agent | Apply daily PnL, max loss, max contracts, RR, add-risk, and safety overrides. | Veto new entries. Allow close/reduce-only state. | Never loosen limits because setup quality is high. | `execution_allowed`, `new_entries_allowed`, `add_allowed`, `close_reduce_only`, `risk_reason`, `daily_pnl_status`, `position_risk_status` |
| TP/SL Agent | Convert a valid setup into entry, stop, target, RR, and invalidation. | Reject setups with missing stop, target, or RR. | Never use fixed stop/target when structure contradicts it. | `entry`, `manual_stop`, `manual_take_profit`, `RR`, `invalidation`, `reduce_zone`, `breakeven_rule` |
| Position Manager Agent | Decide whether current position needs hold, reduce, close, or manual intervention. | Prioritize existing position risk over new entry ideas. | Never add when position state is unclear. | `position_status`, `position_size`, `open_pnl`, `position_risk_status`, `management_action` |
| Execution Agent | Execute only one permitted Demo/Replay/Paper action after all prior checks pass. | Buy, Sell, Reduce, Close, Cancel, or Wait according to mode and risk. | Never override Safety, Authorization, or Risk Manager. Never repeat an unclear click. | `action`, `clicked`, `qty`, `fill_confirmed`, `execution_reason`, `required_manual_intervention` |
| Heartbeat Reporter Agent | Produce the final concise XML status. | Use `NOTIFY` for execution, unclear fills, Real/Live risk, or manual intervention. Use `DONT_NOTIFY` for ordinary Wait. | Never output JSON as the final heartbeat. Never hide missing safety status. | `notify`, `decision`, `execution_allowed`, `action`, `message` |

## Fail-Closed Rules

Immediately block execution and continue to `heartbeat-reporting` when:

- Account mode is Real, Live, or unclear.
- Symbol is not MNQ or MNQM6.
- Position, qty, PnL, current price, or Close/Exit control is hidden.
- Previous click fill status is unknown.
- Working orders are unclear.
- Daily PnL has hit the profit lockout or loss stop.
- Entry, manual stop, manual take profit, RR, or invalidation is missing.
- More than one click would be needed in the same heartbeat round.

When blocked, the only allowed execution decision is `Wait`, `Close`, `Reduce`, or `Manual Intervention`, depending on the visible position risk.

## Failure Messages

Use short, stable reasons so the customer understands what to fix:

- Account mode unclear: `帳戶模式無法確認，暫停自動操作。請確認畫面是 Demo、Replay 或 Paper Trading。`
- Real or Live detected: `畫面出現 Real / Live / 真實帳戶，禁止自動點擊。`
- Symbol unclear: `商品無法確認為 MNQ / MNQM6，暫停。`
- Qty hidden: `qty 不可見，不能安全確認下單口數。`
- PnL hidden: `PnL 不可見，不能確認日內風險狀態。`
- Close/Exit hidden: `Close / Exit 控制不可見，不能安全管理部位。`
- Fill unclear: `上一個點擊成交狀態不明，禁止重複點擊。`
- Working orders unclear: `Working orders 狀態不明，請人工確認是否有危險掛單。`

## Workflow Contract

Before final XML reporting, maintain these internal fields:

- `environment_status`
- `authorization_mode`
- `safety_result`
- `market_scan_result`
- `risk_result`
- `tp_sl_result`
- `position_result`
- `execution_decision`
- `action_taken`
- `fill_status`
- `blocked_reason`
- `manual_intervention_required`
- `next_run_instruction`

These fields may be used for local run logs or schema validation, but the final heartbeat response must still follow `heartbeat-reporting` XML rules.

## Decision Policy

Use the strictest result when skills disagree:

- If safety blocks execution, execution is blocked.
- If authorization blocks automation, execution is blocked.
- If risk blocks new entries, do not open a position.
- If TP/SL cannot define `RR >= 1.2`, wait.
- If position data is unclear, do not add. Prefer reduce, close, or manual intervention only when controls and position are visible.
- If execution occurs but fill cannot be confirmed, stop all further clicks and require manual intervention.

## Output

The final response must be produced through `heartbeat-reporting`.

Return XML with:

- `notify`
- `decision`
- `execution_allowed`
- `action`
- `message`

The message must include safety status, trend, MACD, RSI, Volume, reason, key levels, fill status when relevant, and next step.

## Example Final Heartbeat XML

Ordinary wait:

```xml
<heartbeat>
  <DONT_NOTIFY/>
  <message>
Agent 分析：等待｜估計勝率 58%
Agent 分析：進場｜不允許
綜合評比：等待確認
理由：setup_score 66/72、confidence 61/68，RR 達標但價格尚未觸發進場條件。
  </message>
</heartbeat>
```

Manual intervention:

```xml
<heartbeat>
  <NOTIFY/>
  <message>
Agent 分析：等待｜勝率資料不足
Agent 分析：進場｜不允許
綜合評比：需要人工確認，暫不進場
理由：帳戶模式無法確認，禁止自動點擊。
  </message>
</heartbeat>
```

Demo execution:

```xml
<heartbeat>
  <NOTIFY/>
  <message>
Agent 分析：等待｜估計勝率低於進場方案
Agent 分析：進場｜估計勝率 76%
綜合評比：已執行 Demo/Paper 進場
理由：動作=Buy；商品=MNQ；qty=1；entry=已觸發；SL=結構低點；TP=下一壓力；RR=1.6；成交檢查=成交。
  </message>
</heartbeat>
```
