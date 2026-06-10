function requireTool(path) {
    if (path === "meta") {
        try {
            return require("./tools/meta");
        } catch (error) {
            return require("../tools/meta");
        }
    }

    if (path === "graphics") {
        try {
            return require("./tools/graphics");
        } catch (error) {
            return require("../tools/graphics");
        }
    }

    throw new Error(`Unsupported tool: ${path}`);
}

const meta = requireTool("meta");
const { px, du, op } = requireTool("graphics");

function numberOr(value, fallback) {
    return Number.isFinite(value) ? value : fallback;
}

function barValue(bar, methodName, fallback) {
    if (!bar || typeof bar[methodName] !== "function") {
        return fallback;
    }

    const value = bar[methodName]();
    return numberOr(value, fallback);
}

function barVolume(bar) {
    if (!bar) {
        return 0;
    }

    const candidates = ["volume", "vol", "tradeVolume"];
    for (let i = 0; i < candidates.length; i += 1) {
        const name = candidates[i];
        if (typeof bar[name] === "function") {
            const value = bar[name]();
            if (Number.isFinite(value) && value > 0) {
                return value;
            }
        }
    }

    return 0;
}

function barTimestamp(bar) {
    if (!bar || typeof bar.timestamp !== "function") {
        return null;
    }

    const value = bar.timestamp();
    if (value instanceof Date) {
        return value;
    }

    const date = new Date(value);
    return Number.isFinite(date.getTime()) ? date : null;
}

function dayKey(date) {
    if (!date) {
        return null;
    }

    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function trueRange(current, previousClose) {
    const high = current.high;
    const low = current.low;

    if (!Number.isFinite(previousClose)) {
        return high - low;
    }

    return Math.max(
        high - low,
        Math.abs(high - previousClose),
        Math.abs(low - previousClose)
    );
}

function formatPrice(price) {
    return Number.isFinite(price) ? price.toFixed(2) : "n/a";
}

function formatRR(rr) {
    return Number.isFinite(rr) ? rr.toFixed(1) : "n/a";
}

class MNQAggressiveRiskSignal {
    init() {
        this.bars = [];
        this.vwapNumerator = 0;
        this.vwapDenominator = 0;
        this.lastBuyIndex = -Infinity;
        this.lastSellIndex = -Infinity;
        this.lastExitIndex = -Infinity;
        this.lastAnySignalIndex = -Infinity;
        this.lastSignalSide = null;
        this.currentDayKey = null;
        this.todayHigh = NaN;
        this.todayLow = NaN;
        this.previousDayHigh = NaN;
        this.previousDayLow = NaN;
        this.lastLevelDrawIndex = -Infinity;
        this.barsInCurrentDay = 0;
        this.openingRangeHigh = NaN;
        this.openingRangeLow = NaN;
    }

    map(d) {
        const props = this.props;
        const index = d.index();
        const open = barValue(d, "open", barValue(d, "close", 0));
        const high = barValue(d, "high", open);
        const low = barValue(d, "low", open);
        const close = barValue(d, "close", open);
        const volume = barVolume(d);
        const timestamp = barTimestamp(d);
        this.updateDailyLevels(timestamp, high, low, props.openingRangeBars);
        const typical = (high + low + close) / 3;
        const prevBar = this.bars.length ? this.bars[this.bars.length - 1] : null;
        const previousClose = prevBar ? prevBar.close : NaN;

        this.vwapNumerator += typical * (volume || 1);
        this.vwapDenominator += volume || 1;

        const current = {
            index,
            open,
            high,
            low,
            close,
            volume,
            typical,
            tr: trueRange({ high, low }, previousClose),
            vwap: this.vwapNumerator / this.vwapDenominator
        };

        const lookbackPeriod = Math.max(2, props.lookbackPeriod);
        const atrPeriod = Math.max(2, props.atrPeriod);
        const minBars = Math.max(lookbackPeriod, atrPeriod) + 1;

        if (this.bars.length < minBars) {
            this.bars.push(current);
            return {};
        }

        const lookbackBars = this.bars.slice(-lookbackPeriod);
        const decisionBars = this.bars.slice(-Math.max(2, props.decisionLookbackBars));
        const atrBars = this.bars.slice(-atrPeriod);
        const resistance = Math.max.apply(null, lookbackBars.map(bar => bar.high));
        const support = Math.min.apply(null, lookbackBars.map(bar => bar.low));
        const decisionResistance = Math.max.apply(null, decisionBars.map(bar => bar.high));
        const decisionSupport = Math.min.apply(null, decisionBars.map(bar => bar.low));
        const atr = atrBars.reduce((sum, bar) => sum + bar.tr, 0) / atrBars.length;
        const range = high - low;
        const body = Math.abs(close - open);
        const closePosition = range > 0 ? (close - low) / range : 0.5;
        const prevClose = prevBar.close;
        const prevVwap = prevBar.vwap;
        const avgVolume = lookbackBars.reduce((sum, bar) => sum + bar.volume, 0) / lookbackBars.length;
        const hasUsefulVolume = volume > 0 && avgVolume > 0;
        const volumeExpanded = hasUsefulVolume && volume > avgVolume;
        const buffer = atr * props.atrStopMultiplier;
        const overextended = Math.abs(close - current.vwap) > atr * 2.5;
        const trendBars = this.bars.slice(-Math.max(3, props.trendLookbackBars));
        const trendUp = close > current.vwap
            && trendBars.length > 0
            && close > trendBars[0].close
            && trendBars.filter(bar => bar.close > bar.vwap).length >= Math.ceil(trendBars.length * 0.65);
        const trendDown = close < current.vwap
            && trendBars.length > 0
            && close < trendBars[0].close
            && trendBars.filter(bar => bar.close < bar.vwap).length >= Math.ceil(trendBars.length * 0.65);
        const nearDecisionResistance = Math.abs(close - decisionResistance) <= buffer;
        const nearDecisionSupport = Math.abs(close - decisionSupport) <= buffer;

        const buyBreakout = close > decisionResistance && prevClose <= decisionResistance;
        const buyPullbackHold = low <= decisionSupport + buffer && close > decisionSupport && close > open;
        const buyVwap = close > current.vwap;
        const buyVwapReclaim = prevClose <= prevVwap && close > current.vwap;
        const buyStrongClose = closePosition >= 0.62 && body >= range * 0.35;
        const buyMajorEvent = trendUp
            && ((buyBreakout && buyVwap) || (buyVwapReclaim && nearDecisionResistance));
        const buyStop = Math.min(decisionSupport, low) - buffer;
        const buyRisk = close - buyStop;
        const buyTarget = close + Math.max(buyRisk * props.minRR, atr * 1.5, decisionResistance - close + atr);
        const buyReward = buyTarget - close;
        const buyRR = buyRisk > 0 ? buyReward / buyRisk : 0;

        const sellBreakdown = close < decisionSupport && prevClose >= decisionSupport;
        const sellRejection = high >= decisionResistance - buffer && close < decisionResistance && close < open;
        const sellVwap = close < current.vwap;
        const sellVwapReject = prevClose >= prevVwap && close < current.vwap;
        const sellStrongClose = closePosition <= 0.38 && body >= range * 0.35;
        const sellMajorEvent = trendDown
            && ((sellBreakdown && sellVwap) || (sellVwapReject && nearDecisionSupport));
        const sellStop = Math.max(decisionResistance, high) + buffer;
        const sellRisk = sellStop - close;
        const sellTarget = close - Math.max(sellRisk * props.minRR, atr * 1.5, close - decisionSupport + atr);
        const sellReward = close - sellTarget;
        const sellRR = sellRisk > 0 ? sellReward / sellRisk : 0;

        const buyScore = this.scoreSignal({
            trendAligned: buyVwap || buyVwapReclaim,
            structureTriggered: buyBreakout || buyPullbackHold,
            candleHealthy: buyStrongClose,
            atrHealthy: atr > 0 && !overextended,
            rrOk: buyRR >= props.minRR,
            volumeExpanded
        });

        const sellScore = this.scoreSignal({
            trendAligned: sellVwap || sellVwapReject,
            structureTriggered: sellBreakdown || sellRejection,
            candleHealthy: sellStrongClose,
            atrHealthy: atr > 0 && !overextended,
            rrOk: sellRR >= props.minRR,
            volumeExpanded
        });

        const globalCooldownPassed = index - this.lastAnySignalIndex >= props.globalSignalCooldownBars;
        const buyStructureClear = props.majorEventsOnly
            ? buyMajorEvent
            : buyBreakout || (props.allowPullbackSignals && buyPullbackHold);
        const sellStructureClear = props.majorEventsOnly
            ? sellMajorEvent
            : sellBreakdown || (props.allowRejectionSignals && sellRejection);
        const exitLong = this.lastSignalSide === "BUY"
            && globalCooldownPassed
            && index - this.lastExitIndex >= props.exitCooldown
            && close < current.vwap
            && (close < decisionSupport || closePosition <= 0.38);
        const exitShort = this.lastSignalSide === "SELL"
            && globalCooldownPassed
            && index - this.lastExitIndex >= props.exitCooldown
            && close > current.vwap
            && (close > decisionResistance || closePosition >= 0.62);

        const canBuy = buyScore.confidence >= props.minConfidence
            && globalCooldownPassed
            && buyRR >= props.minRR
            && buyStructureClear
            && (buyVwap || buyVwapReclaim)
            && buyStrongClose
            && index - this.lastBuyIndex >= props.signalCooldown
            && (!props.requireOppositeReset || this.lastSignalSide !== "BUY");

        const canSell = sellScore.confidence >= props.minConfidence
            && globalCooldownPassed
            && sellRR >= props.minRR
            && sellStructureClear
            && (sellVwap || sellVwapReject)
            && sellStrongClose
            && index - this.lastSellIndex >= props.signalCooldown
            && (!props.requireOppositeReset || this.lastSignalSide !== "SELL");

        let graphics = null;

        if (exitLong) {
            this.lastExitIndex = index;
            this.lastAnySignalIndex = index;
            this.lastSignalSide = null;
            graphics = this.buildExitGraphics({
                side: "EXIT LONG",
                index,
                price: close,
                labelPrice: high + atr * 0.45,
                color: "#f5a623",
                reason: close < decisionSupport ? "Lost 30m support" : "Lost VWAP"
            });
        } else if (exitShort) {
            this.lastExitIndex = index;
            this.lastAnySignalIndex = index;
            this.lastSignalSide = null;
            graphics = this.buildExitGraphics({
                side: "EXIT SHORT",
                index,
                price: close,
                labelPrice: low - atr * 0.45,
                color: "#f5a623",
                reason: close > decisionResistance ? "Reclaimed 30m resistance" : "Reclaimed VWAP"
            });
        } else if (canBuy && (!canSell || buyScore.confidence >= sellScore.confidence)) {
            this.lastBuyIndex = index;
            this.lastAnySignalIndex = index;
            this.lastSignalSide = "BUY";
            graphics = this.buildSignalGraphics({
                side: "BUY",
                index,
                entry: close,
                stop: buyStop,
                target: buyTarget,
                markerPrice: low - atr * 0.25,
                labelPrice: low - atr * 0.8,
                confidence: buyScore.confidence,
                rr: buyRR,
                color: "#18a058",
                reasons: this.buyReasons(buyBreakout, buyPullbackHold, buyVwapReclaim, volumeExpanded),
                extendBars: props.extendRiskLines ? props.riskLineBars : 1
            });
        } else if (canSell) {
            this.lastSellIndex = index;
            this.lastAnySignalIndex = index;
            this.lastSignalSide = "SELL";
            graphics = this.buildSignalGraphics({
                side: "SELL",
                index,
                entry: close,
                stop: sellStop,
                target: sellTarget,
                markerPrice: high + atr * 0.25,
                labelPrice: high + atr * 0.8,
                confidence: sellScore.confidence,
                rr: sellRR,
                color: "#d13f3f",
                reasons: this.sellReasons(sellBreakdown, sellRejection, sellVwapReject, volumeExpanded),
                extendBars: props.extendRiskLines ? props.riskLineBars : 1
            });
        } else if (props.showWatchLabels) {
            graphics = this.buildWatchGraphics({
                index,
                high,
                low,
                close,
                atr,
                nearResistance: nearDecisionResistance,
                nearSupport: nearDecisionSupport,
                trendUp,
                trendDown,
                buyScore: buyScore.confidence,
                sellScore: sellScore.confidence
            });
        }

        this.bars.push(current);

        const shouldDrawLevels = graphics
            || index - this.lastLevelDrawIndex >= props.levelRefreshBars;
        const levelGraphics = shouldDrawLevels
            ? this.buildNearbyLevelGraphics({
                index,
                close,
                atr,
                decisionSupport,
                decisionResistance,
                lineBars: props.levelLineBars,
                nearbyAtrMultiplier: props.nearbyLevelAtrMultiplier
            })
            : null;

        if (levelGraphics) {
            this.lastLevelDrawIndex = index;
        }

        if (graphics && levelGraphics) {
            graphics.items = levelGraphics.items.concat(graphics.items);
        } else if (!graphics) {
            graphics = levelGraphics;
        }

        return graphics ? { graphics } : {};
    }

    updateDailyLevels(timestamp, high, low, openingRangeBars) {
        const key = dayKey(timestamp);
        if (!key) {
            this.todayHigh = Number.isFinite(this.todayHigh) ? Math.max(this.todayHigh, high) : high;
            this.todayLow = Number.isFinite(this.todayLow) ? Math.min(this.todayLow, low) : low;
            this.updateOpeningRange(high, low, openingRangeBars);
            return;
        }

        if (this.currentDayKey && key !== this.currentDayKey) {
            this.previousDayHigh = this.todayHigh;
            this.previousDayLow = this.todayLow;
            this.todayHigh = high;
            this.todayLow = low;
            this.currentDayKey = key;
            this.barsInCurrentDay = 1;
            this.openingRangeHigh = high;
            this.openingRangeLow = low;
            return;
        }

        if (!this.currentDayKey) {
            this.currentDayKey = key;
            this.todayHigh = high;
            this.todayLow = low;
            this.barsInCurrentDay = 1;
            this.openingRangeHigh = high;
            this.openingRangeLow = low;
            return;
        }

        this.todayHigh = Math.max(this.todayHigh, high);
        this.todayLow = Math.min(this.todayLow, low);
        this.updateOpeningRange(high, low, openingRangeBars);
    }

    updateOpeningRange(high, low, openingRangeBars) {
        this.barsInCurrentDay += 1;
        if (this.barsInCurrentDay <= openingRangeBars) {
            this.openingRangeHigh = Number.isFinite(this.openingRangeHigh)
                ? Math.max(this.openingRangeHigh, high)
                : high;
            this.openingRangeLow = Number.isFinite(this.openingRangeLow)
                ? Math.min(this.openingRangeLow, low)
                : low;
        }
    }

    scoreSignal(parts) {
        let confidence = 0;
        if (parts.trendAligned) {
            confidence += 20;
        }
        if (parts.structureTriggered) {
            confidence += 25;
        }
        if (parts.candleHealthy) {
            confidence += 15;
        }
        if (parts.atrHealthy) {
            confidence += 10;
        }
        if (parts.rrOk) {
            confidence += 20;
        }
        if (parts.volumeExpanded) {
            confidence += 10;
        }

        return { confidence };
    }

    buyReasons(breakout, pullbackHold, vwapReclaim, volumeExpanded) {
        const reasons = [];
        if (breakout) {
            reasons.push("Breakout");
        }
        if (pullbackHold) {
            reasons.push("Support hold");
        }
        reasons.push(vwapReclaim ? "VWAP reclaim" : "Above VWAP");
        if (volumeExpanded) {
            reasons.push("Vol expand");
        }
        return reasons;
    }

    sellReasons(breakdown, rejection, vwapReject, volumeExpanded) {
        const reasons = [];
        if (breakdown) {
            reasons.push("Support break");
        }
        if (rejection) {
            reasons.push("Resistance reject");
        }
        reasons.push(vwapReject ? "VWAP reject" : "Below VWAP");
        if (volumeExpanded) {
            reasons.push("Vol expand");
        }
        return reasons;
    }

    isNearSetup(state) {
        const buyNear = (state.buyBreakout || state.buyPullbackHold) && state.buyVwap
            && state.buyScore.confidence >= 45;
        const sellNear = (state.sellBreakdown || state.sellRejection) && state.sellVwap
            && state.sellScore.confidence >= 45;
        return buyNear || sellNear;
    }

    buildSignalGraphics(signal) {
        const endIndex = signal.index + signal.extendBars;
        const reason = signal.reasons.join(" + ");
        const compactLabel = `${signal.side} ${signal.confidence}% RR ${formatRR(signal.rr)}`;
        const detailLabel = `${signal.side} ${signal.confidence}% | ${reason} | RR ${formatRR(signal.rr)}`;
        const stopLabel = `SL ${formatPrice(signal.stop)}`;
        const targetLabel = `TP ${formatPrice(signal.target)}`;
        const key = `${signal.side.toLowerCase()}-${signal.index}`;

        return {
            items: [
                {
                    tag: "Shapes",
                    key: `${key}-dot`,
                    primitives: [
                        {
                            tag: "Circle",
                            radius: 6,
                            center: {
                                x: du(signal.index),
                                y: du(signal.markerPrice)
                            }
                        }
                    ],
                    fillStyle: {
                        color: signal.color
                    }
                },
                {
                    tag: "Text",
                    key: `${key}-compact`,
                    conditions: {
                        scaleRangeX: { min: 10 }
                    },
                    point: {
                        x: du(signal.index),
                        y: du(signal.labelPrice)
                    },
                    text: compactLabel,
                    style: { fontSize: 18, fontWeight: "bold", fill: signal.color },
                    textAlignment: "centerMiddle"
                },
                {
                    tag: "Text",
                    key: `${key}-detail`,
                    conditions: {
                        scaleRangeX: { min: 24 }
                    },
                    point: {
                        x: du(signal.index),
                        y: op(du(signal.labelPrice), signal.side === "BUY" ? "-" : "+", px(16))
                    },
                    text: detailLabel,
                    style: { fontSize: 13, fontWeight: "bold", fill: signal.color },
                    textAlignment: "centerMiddle"
                },
                {
                    tag: "LineSegments",
                    key: `${key}-risk-lines`,
                    conditions: {
                        scaleRangeX: { min: 22 }
                    },
                    lines: [
                        {
                            tag: "Line",
                            a: { x: du(signal.index), y: du(signal.stop) },
                            b: { x: du(endIndex), y: du(signal.stop) }
                        },
                        {
                            tag: "Line",
                            a: { x: du(signal.index), y: du(signal.target) },
                            b: { x: du(endIndex), y: du(signal.target) }
                        }
                    ],
                    lineStyle: {
                        lineWidth: 3,
                        color: signal.color
                    }
                },
                {
                    tag: "Text",
                    key: `${key}-stop-label`,
                    conditions: {
                        scaleRangeX: { min: 18 }
                    },
                    point: {
                        x: du(endIndex),
                        y: du(signal.stop)
                    },
                    text: stopLabel,
                    style: { fontSize: 12, fontWeight: "bold", fill: "#d13f3f" },
                    textAlignment: "leftMiddle"
                },
                {
                    tag: "Text",
                    key: `${key}-target-label`,
                    conditions: {
                        scaleRangeX: { min: 18 }
                    },
                    point: {
                        x: du(endIndex),
                        y: du(signal.target)
                    },
                    text: targetLabel,
                    style: { fontSize: 12, fontWeight: "bold", fill: "#18a058" },
                    textAlignment: "leftMiddle"
                }
            ]
        };
    }

    buildExitGraphics(signal) {
        const shortLabel = signal.side === "EXIT LONG" ? "XL" : "XS";
        const key = `${shortLabel.toLowerCase()}-${signal.index}`;

        return {
            items: [
                {
                    tag: "Shapes",
                    key: `${key}-dot`,
                    primitives: [
                        {
                            tag: "Circle",
                            radius: 6,
                            center: {
                                x: du(signal.index),
                                y: du(signal.price)
                            }
                        }
                    ],
                    fillStyle: {
                        color: signal.color
                    }
                },
                {
                    tag: "Text",
                    key: `${key}-label`,
                    conditions: {
                        scaleRangeX: { min: 12 }
                    },
                    point: {
                        x: du(signal.index),
                        y: du(signal.labelPrice)
                    },
                    text: `${shortLabel} | ${signal.reason}`,
                    style: { fontSize: 18, fontWeight: "bold", fill: signal.color },
                    textAlignment: "centerMiddle"
                }
            ]
        };
    }

    buildWatchGraphics(watch) {
        if (!Number.isFinite(watch.atr) || watch.atr <= 0) {
            return null;
        }

        let text = null;
        let price = watch.close;
        let color = "#d8a33a";

        if (watch.nearResistance && watch.trendUp && watch.buyScore >= 55) {
            text = "WATCH R";
            price = watch.high + watch.atr * 0.35;
        } else if (watch.nearSupport && watch.trendDown && watch.sellScore >= 55) {
            text = "WATCH S";
            price = watch.low - watch.atr * 0.35;
        }

        if (!text) {
            return null;
        }

        return {
            items: [
                {
                    tag: "Text",
                    key: `watch-${watch.index}`,
                    conditions: {
                        scaleRangeX: { min: 16 }
                    },
                    point: {
                        x: du(watch.index),
                        y: du(price)
                    },
                    text,
                    style: { fontSize: 13, fontWeight: "bold", fill: color },
                    textAlignment: "centerMiddle"
                }
            ]
        };
    }

    buildNearbyLevelGraphics(levels) {
        if (!Number.isFinite(levels.atr) || levels.atr <= 0) {
            return null;
        }

        const items = [];
        const maxDistance = levels.atr * levels.nearbyAtrMultiplier;
        const endIndex = levels.index + levels.lineBars;
        const candidates = [
            { title: "30m R", price: levels.decisionResistance, color: "#f5a623" },
            { title: "30m S", price: levels.decisionSupport, color: "#33c481" },
            { title: "TOD H", price: this.todayHigh, color: "#55aaff" },
            { title: "TOD L", price: this.todayLow, color: "#55aaff" },
            { title: "ORH", price: this.openingRangeHigh, color: "#ffffff" },
            { title: "ORL", price: this.openingRangeLow, color: "#ffffff" },
            { title: "PDH", price: this.previousDayHigh, color: "#d58cff" },
            { title: "PDL", price: this.previousDayLow, color: "#d58cff" }
        ];

        for (let i = 0; i < candidates.length; i += 1) {
            const level = candidates[i];
            if (!Number.isFinite(level.price) || Math.abs(levels.close - level.price) > maxDistance) {
                continue;
            }

            const key = `${level.title.replace(/\s/g, "-").toLowerCase()}-${levels.index}`;
            items.push({
                tag: "LineSegments",
                key: `${key}-line`,
                lines: [
                    {
                        tag: "Line",
                        a: { x: du(levels.index), y: du(level.price) },
                        b: { x: du(endIndex), y: du(level.price) }
                    }
                ],
                lineStyle: {
                    lineWidth: 2,
                    color: level.color
                }
            });
            items.push({
                tag: "Text",
                key: `${key}-label`,
                point: {
                    x: du(endIndex),
                    y: du(level.price)
                },
                text: `${level.title} ${formatPrice(level.price)}`,
                style: { fontSize: 13, fontWeight: "bold", fill: level.color },
                textAlignment: "leftMiddle"
            });
        }

        return items.length ? { items } : null;
    }
}

module.exports = {
    name: "MNQ Aggressive Risk Signal",
    description: "Draws MNQ/MNQM6 Buy/Sell signals with stop, target, RR, reason, and confidence. Signal-only indicator; it does not authorize execution.",
    calculator: MNQAggressiveRiskSignal,
    inputType: meta.InputType.BARS,
    params: {
        lookbackPeriod: {
            type: "number",
            def: 20,
            restrictions: { step: 1, min: 5 }
        },
        decisionLookbackBars: {
            type: "number",
            def: 6,
            restrictions: { step: 1, min: 2 }
        },
        trendLookbackBars: {
            type: "number",
            def: 6,
            restrictions: { step: 1, min: 3 }
        },
        openingRangeBars: {
            type: "number",
            def: 6,
            restrictions: { step: 1, min: 1 }
        },
        atrPeriod: {
            type: "number",
            def: 14,
            restrictions: { step: 1, min: 2 }
        },
        atrStopMultiplier: {
            type: "number",
            def: 0.6,
            restrictions: { step: 0.1, min: 0.1 }
        },
        minRR: {
            type: "number",
            def: 1.2,
            restrictions: { step: 0.1, min: 0.1 }
        },
        minConfidence: {
            type: "number",
            def: 82,
            restrictions: { step: 1, min: 0, max: 100 }
        },
        signalCooldown: {
            type: "number",
            def: 60,
            restrictions: { step: 1, min: 0 }
        },
        globalSignalCooldownBars: {
            type: "number",
            def: 10,
            restrictions: { step: 1, min: 0 }
        },
        exitCooldown: {
            type: "number",
            def: 20,
            restrictions: { step: 1, min: 0 }
        },
        requireOppositeReset: {
            type: "boolean",
            def: true
        },
        majorEventsOnly: {
            type: "boolean",
            def: true
        },
        allowPullbackSignals: {
            type: "boolean",
            def: false
        },
        allowRejectionSignals: {
            type: "boolean",
            def: false
        },
        showWaitLabels: {
            type: "boolean",
            def: false
        },
        showWatchLabels: {
            type: "boolean",
            def: true
        },
        extendRiskLines: {
            type: "boolean",
            def: true
        },
        riskLineBars: {
            type: "number",
            def: 2,
            restrictions: { step: 1, min: 1 }
        },
        levelLineBars: {
            type: "number",
            def: 24,
            restrictions: { step: 1, min: 2 }
        },
        levelRefreshBars: {
            type: "number",
            def: 20,
            restrictions: { step: 1, min: 1 }
        },
        nearbyLevelAtrMultiplier: {
            type: "number",
            def: 3,
            restrictions: { step: 0.25, min: 0.5 }
        }
    },
    tags: ["Jay", "MNQ", "Risk", "Signals"]
};
