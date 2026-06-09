---
name: order-execution
description: Execute only permitted Demo/Replay/Paper MNQ/MNQM6 order actions after safety, authorization, risk, and setup checks pass. Use when Codex is asked to decide or perform Buy, Sell, Add, Reduce, Close, or Wait actions on Tradovate/TradeDay-style trading controls, including quantity checks and no-repeat-click safeguards.
---

# Order Execution

## Purpose

Use this skill only after `platform-safety`, `authorization-modes`, `market-scan`, `risk-control`, and `take-profit-stop-loss` have produced valid results.

## Non-Negotiable Rules

- Never click in Real or Live mode.
- Never click when account mode is unclear.
- Never click if Close/Exit is not visible.
- Never click more than once per heartbeat round.
- Never repeat a click when fill status is unclear.
- Never open a new position while an existing position is open.

## Entry Requirements

For a new Buy or Sell:

- `position = 0`
- `execution_allowed = true`
- `authorization_mode = demo_auto_execute`
- `setup_score >= 72`
- `confidence >= 68`
- `RR >= 1.2`
- Entry is clear.
- `manual_stop` is clear.
- `manual_take_profit` is clear.
- Invalidation is clear.

## Quantity Rules

- If qty is clearly visible as 2, first entry may use 2 contracts.
- If qty is hidden or uncertain, first entry must use 1 contract.
- Do not double-click to create 2 contracts.
- Add orders must respect the 6-contract campaign maximum.

## Buy Flow

1. Verify no position.
2. Confirm buy setup passed.
3. Confirm qty.
4. Confirm stop, take profit, RR, and invalidation.
5. Click Buy only in Demo/Replay/Paper.
6. Confirm fill or order status.
7. If fill cannot be confirmed, return `required_manual_intervention=true`.

## Sell Flow

1. Verify no position.
2. Confirm sell setup passed.
3. Confirm qty.
4. Confirm stop, take profit, RR, and invalidation.
5. Click Sell only in Demo/Replay/Paper.
6. Confirm fill or order status.
7. If fill cannot be confirmed, return `required_manual_intervention=true`.

## Close / Reduce Flow

Close or Reduce is allowed when:

- Existing position is open.
- Close/Exit control is visible.
- Total invalidation is hit.
- PnL is giving back quickly.
- Daily loss limit is threatened.
- Risk data becomes unclear.

## Output

Return:

- action: Wait / Buy / Sell / Add / Reduce / Close
- clicked: true/false
- qty
- fill_confirmed
- execution_reason
- required_manual_intervention

