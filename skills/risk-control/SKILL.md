---
name: risk-control
description: Apply MNQ/MNQM6 trading risk limits and guardrails before any AI-assisted order decision. Use when Codex must evaluate daily PnL, open PnL, position size, campaign exposure, loss limits, profit lockout, stop rules, add risk, and whether trading should be blocked, reduced, closed, or allowed only in Demo/Replay/Paper mode.
---

# Risk Control

## Purpose

Use this skill before any order execution or position management decision. Risk control overrides market scan quality.

## Hard Limits

- Allowed environments: Demo, Replay, Paper Trading.
- Forbidden environments: Real, Live, or uncertain account mode.
- Daily profit target: `+1000 USD`.
- Daily maximum loss: `-1500 USD`.
- Main campaign: `2 + 2 + 2`, maximum 6 contracts.
- First entry: maximum 2 contracts only if qty is clearly visible as 2.
- If qty is not visible or not confirmed, first entry maximum is 1 contract.
- One heartbeat round may take at most one action.

## Decision Rules

Set `execution_allowed=false` when:

- Environment is Real, Live, or unclear.
- Symbol is not MNQ or MNQM6.
- Close/Exit control is not visible.
- Position, qty, current price, or PnL cannot be confirmed.
- Daily PnL is at or below `-1500`.
- Trade lacks entry, stop, take profit, RR, or invalidation.
- A previous click happened but fill status cannot be confirmed.

Set `new_entries_allowed=false` when:

- Daily PnL is at or above `+1000`.
- Daily PnL is at or below `-1500`.
- Existing position is open.
- Risk after add would exceed the loss limit.

## Position Risk

For any open position, prioritize:

1. Protect loss limit.
2. Prevent fast PnL giveback.
3. Respect total invalidation.
4. Manage existing position before considering add.
5. Close or reduce when safety data becomes unclear.

## Add Risk

Allow Add only when:

- Existing thesis is still valid.
- Price reaches a defined add zone.
- Total invalidation is clear.
- Added risk remains below `-1500 USD`.
- Confidence is at least 68.
- Total campaign size remains 6 contracts or less.

## Output

Return:

- execution_allowed
- new_entries_allowed
- add_allowed
- close_reduce_only
- risk_reason
- daily_pnl_status
- position_risk_status
- required_manual_intervention

