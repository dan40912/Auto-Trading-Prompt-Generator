---
name: market-scan
description: Analyze MNQ/MNQM6 market structure and technical indicators for AI trading workflows. Use when Codex needs to scan TradingView or Tradovate charts, summarize trend, inspect K candles, VWAP/MA, MACD, RSI, Volume, support/resistance, day high/low, opening price, setup_score, confidence, and trade direction before any risk or execution decision.
---

# Market Scan

## Purpose

Use this skill to read the visible chart context and produce a trade setup assessment. This skill does not authorize orders and must not click anything.

## Required Inputs

- Platform: TradingView or Tradovate
- Symbol: MNQ or MNQM6
- Timeframe: Prefer 1m
- Visible K candles
- VWAP or MA structure
- MACD
- RSI
- Volume
- Support and resistance
- Previous high/low
- Opening price
- Day high/low

If MACD, RSI, Volume, VWAP, or key prices are not visible, mark them as `not_visible`. Do not invent indicator values.

## Workflow

1. Confirm symbol is MNQ or MNQM6.
2. Confirm chart timeframe, preferring 1m.
3. Identify current trend: bullish, bearish, range, chop, or unclear.
4. Locate VWAP/MA relationship: above, below, reclaiming, rejecting, or unavailable.
5. Read MACD state: bullish momentum, bearish momentum, weakening, crossing, or not visible.
6. Read RSI state: strong, weak, overbought, oversold, neutral, divergent, or not visible.
7. Read Volume: expanding, fading, climax, normal, or not visible.
8. Mark support, resistance, opening price, previous high/low, day high/low.
9. Produce setup_score, confidence, direction, and next trigger.

## Setup Scoring

Use `setup_score` from 0 to 100:

- 85-100: strong trend, clean level, indicators aligned, good space.
- 72-84: actionable if risk and authorization pass.
- 55-71: watch only, wait for trigger.
- Below 55: no trade.

Use `confidence` from 0 to 100:

- Reduce confidence when key indicators are hidden.
- Reduce confidence in chop, narrow range, unclear candles, or low volume.
- Never raise confidence using assumed data.

## Buy Setup

A buy setup requires:

- Breakout above resistance, or successful pullback to support.
- Price above or reclaiming VWAP/opening price.
- Upward space before next resistance.
- MACD/RSI/Volume support when visible.

If price is close but not triggered, output wait conditions. Do not recommend clicking.

## Sell Setup

A sell setup requires:

- Breakdown below support, or failed bounce into resistance.
- Price below or rejecting VWAP/opening price.
- Downward space before next support.
- MACD/RSI/Volume support when visible.

If price is close but not triggered, output wait conditions. Do not recommend clicking.

## Output

Return:

- trend
- visible indicators
- not_visible indicators
- support
- resistance
- key prices
- direction: Buy / Sell / Wait
- setup_score
- confidence
- reason
- next_trigger

