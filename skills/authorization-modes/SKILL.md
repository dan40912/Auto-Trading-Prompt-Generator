---
name: authorization-modes
description: Define and enforce authorization levels for AI-assisted MNQ/MNQM6 trading automations. Use when Codex must decide whether it may only observe, analyze, request confirmation, manage existing Demo/Replay/Paper positions, auto execute Demo trades, or block all Real/Live execution.
---

# Authorization Modes

## Purpose

Use this skill before any action that might click a trading control. Authorization mode does not replace platform safety or risk control.

## Modes

| Mode | Meaning | Click Permission |
| --- | --- | --- |
| `observe_only` | Observe chart and platform only | No clicks |
| `analysis_only` | Analyze setup, RR, stop, target | No clicks |
| `confirm_required` | Notify user before action | No clicks until confirmed |
| `demo_auto_manage` | Manage existing Demo/Replay/Paper position | Close/Reduce/Add only if risk allows |
| `demo_auto_execute` | Open and manage Demo/Replay/Paper trades | Buy/Sell/Add/Reduce/Close if all checks pass |
| `live_blocked` | Explicitly block Real/Live action | No clicks |

## Default

Use this default in public examples:

```text
authorization_mode = observe_only
```

Only use `demo_auto_execute` when explicitly requested by the user and platform safety confirms Demo/Replay/Paper.

## Enforcement

Set `execution_allowed=false` when:

- Mode is `observe_only`.
- Mode is `analysis_only`.
- Mode is `confirm_required` and confirmation has not been received.
- Mode is `live_blocked`.
- Platform safety fails.
- Risk control fails.

Even with `demo_auto_execute`, execution still requires:

- Demo/Replay/Paper confirmed.
- MNQ/MNQM6 confirmed.
- Close/Exit visible.
- Risk limits clear.
- Valid setup and RR.
- One action maximum per heartbeat.

## Output

Return:

- authorization_mode
- clicks_allowed
- allowed_actions
- blocked_actions
- authorization_reason

