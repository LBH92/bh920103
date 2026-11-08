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
 * Safely parse any timestamp type (Date, ISO string, epoch ms/seconds, Firestore Timestamp, Korean relative string)
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
      const d = new Date(val.seconds * 1000 + (val.nanoseconds ? Math.floor(val.nanoseconds / 1000000) : 0));
      return isNaN(d.getTime()) ? null : d;
    }
  }
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed) return null;

    // Handle relative strings safely
    const minMatch = trimmed.match(/^(\d+)\s*분\s*전$/);
    if (minMatch) return new Date(Date.now() - parseInt(minMatch[1], 10) * 60 * 1000);
    const hrMatch = trimmed.match(/^(\d+)\s*시간\s*전$/);
    if (hrMatch) return new Date(Date.now() - parseInt(hrMatch[1], 10) * 3600 * 1000);
    const dayMatch = trimmed.match(/^(\d+)\s*일\s*전$/);
    if (dayMatch) return new Date(Date.now() - parseInt(dayMatch[1], 10) * 86400 * 1000);
    if (trimmed === '어제') return new Date(Date.now() - 86400 * 1000);
    // Reject placeholder strings - NEVER evaluate these to current time!
    if (
      trimmed === '방금 전' || 
      trimmed === '방금' || 
      trimmed === '시간 정보 없음' || 
      trimmed === '작성 시간 확인 불가' ||
      trimmed === '날짜 정보 없음' ||
      trimmed === '-'
    ) {
      return null;
    }

    // Check if it includes `작성: YYYY.MM.DD (요일) HH:mm` or `YYYY.MM.DD (요일) HH:mm`
    // Example: "3일 전 · 작성: 2026.11.05 (목) 15:55" or "2026.11.07 (토) 14:35"
    const exactMatch = trimmed.match(/(?:작성:\s*)?(\d{4})[./-](\d{1,2})[./-](\d{1,2})(?:\s*\([^)]*\))?\s*(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?/);
    if (exactMatch) {
      const [, y, mo, d, h, mi, s = '00'] = exactMatch;
      const iso = `${y}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}T${h.padStart(2, '0')}:${mi.padStart(2, '0')}:${s.padStart(2, '0')}+09:00`;
      const parsed = new Date(iso);
      if (!isNaN(parsed.getTime())) return parsed;
    }

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
  const d = parseToDate(val ?? new Date());
  if (!d) return fallback;
  const m = getKstParts(d);
  return `${m.year}년 ${m.month}월 ${m.day}일 (${m.weekday}) ${m.hour}:${m.minute}:${m.second}`;
};

/**
 * Full Date without time: `YYYY년 MM월 DD일 (요일)`
 */
export const formatKSTDateFull = (val?: any, fallback = '-'): string => {
  const d = parseToDate(val ?? new Date());
  if (!d) return fallback;
  const m = getKstParts(d);
  return `${m.year}년 ${m.month}월 ${m.day}일 (${m.weekday})`;
};

/**
 * Compact Date: `YYYY.MM.DD`
 */
export const formatKSTDate = (val?: any, fallback = '-'): string => {
  const d = parseToDate(val);
  if (!d) return typeof val === 'string' && val.length > 0 ? val : fallback;
  const m = getKstParts(d);
  return `${m.year}.${m.month}.${m.day}`;
};

/**
 * Compact Date & Time: `YYYY.MM.DD HH:mm:ss`
 */
export const formatKSTDateTime = (val?: any, fallback = '-'): string => {
  const d = parseToDate(val);
  if (!d) return typeof val === 'string' && val.length > 0 ? val : fallback;
  const m = getKstParts(d);
  return `${m.year}.${m.month}.${m.day} (${m.weekday}) ${m.hour}:${m.minute}`;
};

/**
 * Time Only: `HH:mm:ss`
 */
export const formatKSTTime = (val?: any, fallback = '-'): string => {
  const d = parseToDate(val ?? new Date());
  if (!d) return fallback;
  const m = getKstParts(d);
  return `${m.hour}:${m.minute}:${m.second}`;
};

/**
 * Get KST calendar day key: `YYYY-MM-DD`
 */
export function getKstDateKey(val: any): string {
  const d = parseToDate(val);
  if (!d) return 'unknown';
  const p = getKstParts(d);
  return `${p.year}-${p.month}-${p.day}`;
}

/**
 * Calculate difference in calendar days in KST
 */
export function getKstCalendarDaysDiff(target: Date, now: Date): number {
  const targetParts = getKstParts(target);
  const nowParts = getKstParts(now);
  const targetMidnight = new Date(`${targetParts.year}-${targetParts.month}-${targetParts.day}T00:00:00+09:00`).getTime();
  const nowMidnight = new Date(`${nowParts.year}-${nowParts.month}-${nowParts.day}T00:00:00+09:00`).getTime();
  return Math.round((nowMidnight - targetMidnight) / (86400 * 1000));
}

/**
 * Check if targetDate is yesterday relative to now in KST
 */
export function isYesterdayKST(target: Date, now: Date): boolean {
  return getKstCalendarDaysDiff(target, now) === 1;
}

/**
 * Check if targetDate is today relative to now in KST
 */
export function isTodayKST(target: Date, now: Date): boolean {
  return getKstCalendarDaysDiff(target, now) === 0;
}

/**
 * Canonical Community Time Formatter:
 * - Requirements:
 *   - 상대 시간과 실제 작성 시각을 함께 제공 (예: `3일 전 · 작성: 2026.11.05 (목) 15:55`)
 *   - 작성 시간이 없는 레거시 데이터는 현재 시간으로 대체하지 않고 '작성 시간 확인 불가' 표시
 *   - 방금 전 / 5분 전 / 1시간 전 / 어제 / N일 전 등 상대 시간 적용
 *   - 한국 시간(KST) 기준 날짜와 요일 표시: YYYY.MM.DD (요일) HH:mm
 */
export function formatCommunityTime(val: any): string {
  const d = parseToDate(val);
  if (!d) return typeof val === 'string' && val.length > 0 ? val : '작성 시간 확인 불가';

  const now = new Date();
  const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000);
  const daysDiff = getKstCalendarDaysDiff(d, now);
  const p = getKstParts(d);
  const exact = `${p.year}.${p.month}.${p.day} (${p.weekday}) ${p.hour}:${p.minute}`;

  let relative = '';
  if (diffSec < 60) {
    relative = '방금 전';
  } else if (diffSec < 3600) {
    relative = `${Math.floor(diffSec / 60)}분 전`;
  } else if (daysDiff === 0 && diffSec < 86400) {
    relative = `${Math.floor(diffSec / 3600)}시간 전`;
  } else if (daysDiff === 1) {
    relative = '어제';
  } else if (daysDiff > 1) {
    relative = `${daysDiff}일 전`;
  } else {
    // Clock skew / slightly in future
    relative = '방금 전';
  }

  return `${relative} · 작성: ${exact}`;
}

/**
 * Exact Community Date & Time Formatter:
 * - `2026.11.07 (토) 14:35` or with seconds `2026.11.07 (토) 14:35:20`
 * - Missing or invalid time displays '작성 시간 확인 불가'
 */
export function formatCommunityExactDateTime(val: any, withSeconds = false): string {
  const d = parseToDate(val);
  if (!d) return '작성 시간 확인 불가';

  const p = getKstParts(d);
  if (withSeconds) {
    return `${p.year}.${p.month}.${p.day} (${p.weekday}) ${p.hour}:${p.minute}:${p.second}`;
  }
  return `${p.year}.${p.month}.${p.day} (${p.weekday}) ${p.hour}:${p.minute}`;
}

/**
 * Community Post List Time (Canonical Alias)
 */
export function formatPostListTime(val: any): string {
  return formatCommunityTime(val);
}

/**
 * Community Post Detail Exact Date & Time (Canonical Alias)
 */
export function formatPostExactDateTime(val: any, withSeconds = false): string {
  return formatCommunityExactDateTime(val, withSeconds);
}

/**
 * 3. Chat Date Divider Label:
 * - 오늘
 * - 어제
 * - 2026년 11월 5일 (목)
 * - 2026년 11월 4일 (수)
 */
export function formatChatDividerDate(val: any): string {
  if (val === null || val === undefined || val === '') return '날짜 정보 없음';
  const d = parseToDate(val);
  if (!d) return '날짜 정보 없음';

  const now = new Date();
  if (isTodayKST(d, now)) {
    return '오늘';
  }
  if (isYesterdayKST(d, now)) {
    return '어제';
  }

  const p = getKstParts(d);
  const yearNum = parseInt(p.year, 10);
  const monthNum = parseInt(p.month, 10);
  const dayNum = parseInt(p.day, 10);
  return `${yearNum}년 ${monthNum}월 ${dayNum}일 (${p.weekday})`;
}

/**
 * 4. Chat Message Time:
 * - HH:mm (e.g. 14:35)
 */
export function formatChatTime(val: any): string {
  if (val === null || val === undefined || val === '') return '--:--';
  const d = parseToDate(val);
  if (!d) {
    // If it's already HH:mm:ss or HH:mm string
    if (typeof val === 'string') {
      const parts = val.trim().split(':');
      if (parts.length >= 2) return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
    }
    return '--:--';
  }

  const p = getKstParts(d);
  return `${p.hour}:${p.minute}`;
}

/**
 * 5. Chat Exact Timestamp for detail / tooltip:
 * `2026.11.07 (토) 14:35:20`
 */
export function formatChatExactDateTime(val: any): string {
  if (val === null || val === undefined || val === '') return '시간 정보 없음';
  const d = parseToDate(val);
  if (!d) return '시간 정보 없음';

  const p = getKstParts(d);
  return `${p.year}.${p.month}.${p.day} (${p.weekday}) ${p.hour}:${p.minute}:${p.second}`;
}

/**
 * Backward compatibility aliases
 */
export function formatTimeAgo(val: any): string {
  return formatPostListTime(val);
}

export function formatRelativeTime(val: any): string {
  return formatPostListTime(val);
}
