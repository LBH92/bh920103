/**
 * Date & Time Utility for Asia/Seoul (KST, UTC+9)
 * Canonical format: YYYY년 MM월 DD일 (요일) HH:mm:ss
 */

const kstPartsFormatter = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  weekday: 'short',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

export interface KstDateParts {
  year: string;
  month: string;
  day: string;
  weekday: string;
  hour: string;
  minute: string;
  second: string;
}

export function getKstParts(date: Date): KstDateParts {
  const parts = kstPartsFormatter.formatToParts(date);
  const map: Record<string, string> = {};
  for (const p of parts) {
    map[p.type] = p.value;
  }
  return {
    year: map.year || '',
    month: map.month || '',
    day: map.day || '',
    weekday: map.weekday || '',
    hour: map.hour || '',
    minute: map.minute || '',
    second: map.second || '',
  };
}

/**
 * Safely parse any timestamp type (Date, ISO string, epoch ms/seconds, Firestore Timestamp, Korean date string)
 */
export function parseToDate(val: any): Date | null {
  if (val === null || val === undefined) return null;
  if (val instanceof Date) return isNaN(val.getTime()) ? null : val;
  if (typeof val === 'number') {
    const ms = val < 10000000000 ? val * 1000 : val;
    const d = new Date(ms);
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof val === 'object') {
    if (typeof val.toDate === 'function') {
      try {
        const d = val.toDate();
        return isNaN(d.getTime()) ? null : d;
      } catch {
        return null;
      }
    }
    if (typeof val.seconds === 'number') {
      const d = new Date(val.seconds * 1000);
      return isNaN(d.getTime()) ? null : d;
    }
  }
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed) return null;
    if (trimmed.includes('전') || trimmed.includes('방금')) return null;

    // Check standard ISO or parseable string
    const p1 = new Date(trimmed);
    if (!isNaN(p1.getTime())) return p1;

    // Regex for YYYY.MM.DD HH:mm:ss or YYYY-MM-DD etc.
    const m = trimmed.match(/^(\d{4})[./-](\d{1,2})[./-](\d{1,2})(?:[ T](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
    if (m) {
      const [, y, mo, d, h = '00', mi = '00', s = '00'] = m;
      const iso = `${y}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}T${h.padStart(2, '0')}:${mi.padStart(2, '0')}:${s.padStart(2, '0')}+09:00`;
      const p2 = new Date(iso);
      if (!isNaN(p2.getTime())) return p2;
    }
  }
  return null;
}

/**
 * Standard Home Screen Format: `YYYY년 MM월 DD일 (요일) HH:mm:ss`
 */
export const formatKST = (val?: any, fallback = '-'): string => {
  if (typeof val === 'string' && (val.includes('전') || val.includes('방금'))) return val;
  const d = parseToDate(val ?? new Date());
  if (!d) return fallback;
  const m = getKstParts(d);
  return `${m.year}년 ${m.month}월 ${m.day}일 (${m.weekday}) ${m.hour}:${m.minute}:${m.second}`;
};

/**
 * Full Date without time: `YYYY년 MM월 DD일 (요일)`
 */
export const formatKSTDateFull = (val?: any, fallback = '-'): string => {
  if (typeof val === 'string' && (val.includes('전') || val.includes('방금'))) return val;
  const d = parseToDate(val ?? new Date());
  if (!d) return fallback;
  const m = getKstParts(d);
  return `${m.year}년 ${m.month}월 ${m.day}일 (${m.weekday})`;
};

/**
 * Compact Date: `YYYY.MM.DD`
 */
export const formatKSTDate = (val?: any, fallback = '-'): string => {
  if (typeof val === 'string' && (val.includes('전') || val.includes('방금'))) return val;
  const d = parseToDate(val);
  if (!d) return typeof val === 'string' && val.length > 0 ? val : fallback;
  const m = getKstParts(d);
  return `${m.year}.${m.month}.${m.day}`;
};

/**
 * Compact Date & Time: `YYYY.MM.DD HH:mm:ss`
 */
export const formatKSTDateTime = (val?: any, fallback = '-'): string => {
  if (typeof val === 'string' && (val.includes('전') || val.includes('방금'))) return val;
  const d = parseToDate(val);
  if (!d) return typeof val === 'string' && val.length > 0 ? val : fallback;
  const m = getKstParts(d);
  return `${m.year}.${m.month}.${m.day} ${m.hour}:${m.minute}:${m.second}`;
};

/**
 * Time Only: `HH:mm:ss`
 */
export const formatKSTTime = (val?: any, fallback = '-'): string => {
  if (typeof val === 'string' && (val.includes('전') || val.includes('방금'))) return val;
  const d = parseToDate(val ?? new Date());
  if (!d) return fallback;
  const m = getKstParts(d);
  return `${m.hour}:${m.minute}:${m.second}`;
};

/**
 * Relative time ago with KST fallback
 */
export function formatTimeAgo(val: any): string {
  if (typeof val === 'string' && (val.includes('전') || val.includes('방금'))) return val;
  const d = parseToDate(val);
  if (!d) return typeof val === 'string' && val.length > 0 ? val : '-';
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diffSec < 0) return '방금 전';
  if (diffSec < 60) return '방금 전';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}분 전`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}시간 전`;
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}일 전`;
  return formatKSTDate(d);
}
