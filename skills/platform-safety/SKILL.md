---
name: platform-safety
description: Verify trading platform safety before AI-assisted MNQ/MNQM6 analysis or execution. Use when Codex must confirm TradingView/Tradovate context, Demo/Replay/Paper mode, non-Real/non-Live status, visible symbol, position, PnL, quantity, Buy/Sell/Close/Exit controls, replay state, and working orders before any trading action.
---

# Platform Safety

## Purpose

Use this skill at the start of every heartbeat round. If platform safety fails, all execution must be blocked.

## Required Checks

- Platform is TradingView, Tradovate, TradeDay, or an expected broker panel.
- Environment is Demo, Replay, or Paper Trading.
- Environment is not Real or Live.
- Symbol is MNQ or MNQM6.
- Replay is not paused if replay mode is used.
- Position is visible.
- Average price is visible when position exists.
- Current price is visible.
- Open PnL and daily PnL are visible.
- Buy/Sell controls are visible when opening may be considered.
- Close/Exit controls are visible before any execution is allowed.
- Working orders are visible or explicitly absent.
- Qty is visible or marked uncertain.

## Fail Closed

Set `execution_allowed=false` when:

- Any account mode is unclear.
- Real or Live appears anywhere relevant.
- Symbol is not confirmed.
- Close/Exit is hidden.
- PnL is hidden.
- Position is hidden.
- Fill status from a previous click is unknown.

## TradingView vs Tradovate

TradingView can be used for chart analysis. It is not enough for auto execution unless the broker panel also shows safe account mode, position, PnL, qty, and controls.

Tradovate/TradeDay should be prioritized for execution because it exposes account mode, position, PnL, qty, and order controls.

## Output

Return:

- platform
- account_mode
- live_risk_detected
- symbol_confirmed
- controls_visible
- close_exit_visible
- qty_status
- pnl_visible
- working_orders_status
- execution_allowed
- safety_reason

