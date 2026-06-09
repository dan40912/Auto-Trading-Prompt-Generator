---
name: position-management
description: Manage existing MNQ/MNQM6 positions with Hold, Add, Reduce, or Close decisions. Use when Codex sees an open position and must evaluate average price, current price, open PnL, daily PnL, thesis validity, add zones, total invalidation, PnL giveback, and whether to protect profit or cut risk.
---

# Position Management

## Purpose

Use this skill when `position != 0`. It decides how to manage an existing position. It must not open a fresh opposing trade.

## Allowed Actions

- Hold
- Add
- Reduce
- Close

Do not open a new independent position while one is already open.

## Inputs

- Current position direction and size
- Average price
- Current price
- Open PnL
- Daily PnL
- Entry thesis
- Add zone
- Total invalidation
- VWAP/MA relationship
- MACD, RSI, Volume when visible
- Close/Exit control visibility

## Hold

Hold when:

- Thesis remains valid.
- Price has not reached invalidation.
- PnL is not rapidly giving back.
- No add zone has triggered.
- No close/reduce signal is active.

## Add

Add only when:

- Thesis remains valid.
- Price reaches a defined add zone.
- Confidence is at least 68.
- Total invalidation is clear.
- Added risk remains below the daily maximum loss.
- Campaign size remains 6 contracts or less.

## Reduce

Reduce when:

- PnL is giving back quickly.
- Price hesitates near target or key level.
- Momentum weakens while position is profitable.
- Risk is rising but full invalidation has not triggered.

## Close

Close when:

- Total invalidation is hit.
- Price breaks the key level against the thesis.
- Daily loss limit is threatened.
- Trade data becomes unsafe or unclear.
- Close/Exit control is visible and environment is Demo/Replay/Paper.

## Output

Return:

- position_action: Hold / Add / Reduce / Close
- current_thesis
- invalidation_status
- pnl_status
- add_allowed
- reduce_close_reason
- next_management_level

