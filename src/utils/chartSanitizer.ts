import { CandleData } from '../types';

/**
 * Parses candle time strings into a numeric timestamp for chronological ordering.
 * Supports:
 * - "YYYY-MM-DD" / "YYYY.MM.DD"
 * - "YYYY-MM-DD HH:mm" / "YYYY.MM.DD HH:mm"
 * - "MM/DD HH:mm" / "HH:mm" (resolved cleanly in array order if yearless)
 */
function parseCandleTimestamp(time: string): number | null {
  if (!time || typeof time !== 'string') return null;
  const trimmed = time.trim();

  // Full date or date+time: YYYY-MM-DD [HH:mm[:ss]] or YYYY.MM.DD [HH:mm[:ss]]
  const fullMatch = trimmed.match(
    /^(\d{4})[-./](\d{1,2})[-./](\d{1,2})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/
  );
  if (fullMatch) {
    const year = Number(fullMatch[1]);
    const month = Number(fullMatch[2]) - 1;
    const day = Number(fullMatch[3]);
    const hour = fullMatch[4] ? Number(fullMatch[4]) : 0;
    const min = fullMatch[5] ? Number(fullMatch[5]) : 0;
    const sec = fullMatch[6] ? Number(fullMatch[6]) : 0;
    const ts = Date.UTC(year, month, day, hour, min, sec);
    return Number.isFinite(ts) ? ts : null;
  }

  // Fallback ISO
  if (/^\d{4}-\d{2}-\d{2}T/.test(trimmed)) {
    const ts = Date.parse(trimmed);
    return Number.isFinite(ts) ? ts : null;
  }

  return null;
}

/**
 * Validates and sanitizes OHLCV candle bars without fabricating missing bars:
 * 1. Finite positive numbers (> 0) for open, high, low, close
 * 2. Finite non-negative volume (>= 0)
 * 3. Strict OHLC bounds: high >= max(open, close) and low <= min(open, close)
 * 4. Deduplicates identical `time` keys (retaining latest valid sample for the same bucket)
 * 5. Enforces chronological ascending order when timestamps include full dates
 */
export function sanitizeAndValidateCandles(candles: CandleData[]): CandleData[] {
  if (!Array.isArray(candles) || candles.length === 0) return [];

  const dedupedByTime = new Map<string, { candle: CandleData; ts: number | null; order: number }>();

  for (let i = 0; i < candles.length; i++) {
    const c = candles[i];
    if (!c || typeof c.time !== 'string' || !c.time.trim()) continue;

    const open = Number(c.open);
    const high = Number(c.high);
    const low = Number(c.low);
    const close = Number(c.close);
    const volume = Number.isFinite(Number(c.volume)) && Number(c.volume) >= 0 ? Number(c.volume) : 0;

    if (
      !Number.isFinite(open) || open <= 0 ||
      !Number.isFinite(high) || high <= 0 ||
      !Number.isFinite(low) || low <= 0 ||
      !Number.isFinite(close) || close <= 0
    ) {
      continue;
    }

    if (high < Math.max(open, close) || low > Math.min(open, close) || high < low) {
      continue;
    }

    const timeKey = c.time.trim();
    const ts = parseCandleTimestamp(timeKey);
    const existing = dedupedByTime.get(timeKey);

    dedupedByTime.set(timeKey, {
      candle: {
        time: timeKey,
        open,
        high,
        low,
        close,
        volume,
      },
      ts,
      order: existing ? existing.order : i,
    });
  }

  const entries = Array.from(dedupedByTime.values());
  const allParseable = entries.length > 1 && entries.every(e => e.ts !== null);

  if (allParseable) {
    entries.sort((a, b) => (a.ts as number) - (b.ts as number));
  } else {
    entries.sort((a, b) => a.order - b.order);
  }

  return entries.map(e => e.candle);
}
