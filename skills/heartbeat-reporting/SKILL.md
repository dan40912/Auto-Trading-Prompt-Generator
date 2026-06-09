---
name: heartbeat-reporting
description: Produce heartbeat XML reports for MNQ/MNQM6 AI trading automations. Use when Codex must summarize platform safety, market scan, risk checks, authorization mode, trade decision, execution result, NOTIFY/DONT_NOTIFY status, trend, MACD, RSI, Volume, win probability, reasons, key levels, and next step without outputting JSON.
---

# Heartbeat Reporting

## Purpose

Use this skill at the end of each heartbeat round. Output XML, not JSON.

## Notification Rules

Use `NOTIFY` when:

- Buy, Sell, Add, Reduce, or Close was actually executed.
- Fill status cannot be confirmed after a click.
- Safety fails after a previous action.
- Manual intervention is required.
- Risk limit is hit or nearly hit.

Use `DONT_NOTIFY` when:

- No action was taken.
- Decision is Wait.
- There is no urgent manual intervention.

## Required Message Fields

Every message must include:

- Current trend
- MACD status
- RSI status
- Volume status
- What I will do
- Estimated win probability
- Reason
- Key levels
- Next step

If an indicator is not visible, say `not_visible`.

## XML Shape

Use this shape:

```xml
<heartbeat>
  <notify>DONT_NOTIFY</notify>
  <decision>Wait</decision>
  <execution_allowed>false</execution_allowed>
  <action>None</action>
  <message>
    Trend: ...
    MACD: ...
    RSI: ...
    Volume: ...
    I will do: ...
    Estimated win probability: ...
    Reason: ...
    Key levels: ...
    Next step: ...
  </message>
</heartbeat>
```

When action was executed:

```xml
<heartbeat>
  <notify>NOTIFY</notify>
  <decision>Executed</decision>
  <execution_allowed>true</execution_allowed>
  <action>Buy</action>
  <message>
    Execution: ...
    Fill status: ...
    Trend: ...
    MACD: ...
    RSI: ...
    Volume: ...
    Reason: ...
    Manual stop: ...
    Manual take profit: ...
    Next step: ...
  </message>
</heartbeat>
```

## Prohibited Output

- Do not output JSON.
- Do not omit safety status.
- Do not hide missing indicator visibility.
- Do not claim execution if fill was not confirmed.

