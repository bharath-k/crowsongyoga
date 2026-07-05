// Pure schedule logic. No Node or DOM APIs, so it runs both at build time
// (in Astro components) and in the browser (in the "Today" banner script).

export interface DaySession {
  time: string;
  type: string;
}

export interface SaturdayTheme {
  date: string; // YYYY-MM-DD
  theme: string;
}

export interface ScheduleConfig {
  days: {
    monday: DaySession;
    tuesday: DaySession;
    wednesday: DaySession;
    thursday: DaySession;
    friday: DaySession;
  };
  fridayAlternates: [string, string];
  fridayAnchor: { date: string; label: string };
  saturdayThemes: SaturdayTheme[];
  moonRestDays: string[];
}

export type BannerState =
  | { status: 'moon' }
  | { status: 'closed' }
  | { status: 'saturday'; theme: string }
  | { status: 'open'; time: string; type: string };

const WEEKDAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

// Whole days since the Unix epoch for a YYYY-MM-DD string, interpreted in UTC.
// Using UTC for both inputs keeps the difference free of timezone/DST drift.
function epochDay(dateStr: string): number {
  return Math.floor(Date.parse(`${dateStr}T00:00:00Z`) / 86_400_000);
}

// 0 = Sunday ... 6 = Saturday, for a YYYY-MM-DD string.
export function weekdayIndex(dateStr: string): number {
  return new Date(`${dateStr}T00:00:00Z`).getUTCDay();
}

export function weekdayName(dateStr: string): string {
  return WEEKDAY_NAMES[weekdayIndex(dateStr)];
}

// Today's date in Vancouver as YYYY-MM-DD, regardless of the visitor's location.
export function getVancouverDateStr(now: Date = new Date()): string {
  // en-CA formats dates as YYYY-MM-DD.
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Vancouver',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

export function isMoonRestDay(dateStr: string, cfg: ScheduleConfig): boolean {
  return cfg.moonRestDays.includes(dateStr);
}

// Which of the two Friday offerings falls on the given date.
export function getFridayLabel(dateStr: string, cfg: ScheduleConfig): string {
  const [a, b] = cfg.fridayAlternates;
  const anchorIdx = cfg.fridayAlternates.indexOf(cfg.fridayAnchor.label);
  const startIdx = anchorIdx === -1 ? 0 : anchorIdx;
  const weeks = Math.round((epochDay(dateStr) - epochDay(cfg.fridayAnchor.date)) / 7);
  const idx = (((startIdx + weeks) % 2) + 2) % 2;
  return idx === 0 ? a : b;
}

export function getSaturdayTheme(dateStr: string, cfg: ScheduleConfig): string | null {
  const match = cfg.saturdayThemes.find((t) => t.date === dateStr);
  return match ? match.theme : null;
}

// Work out what is happening at the shala on a given date.
export function getBannerState(dateStr: string, cfg: ScheduleConfig): BannerState {
  if (isMoonRestDay(dateStr, cfg)) {
    return { status: 'moon' };
  }

  const wd = weekdayIndex(dateStr);

  if (wd === 0) {
    return { status: 'closed' };
  }

  if (wd === 6) {
    const theme = getSaturdayTheme(dateStr, cfg);
    return theme ? { status: 'saturday', theme } : { status: 'closed' };
  }

  if (wd === 5) {
    return {
      status: 'open',
      time: cfg.days.friday.time,
      type: getFridayLabel(dateStr, cfg),
    };
  }

  const weekdayKeys = {
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
  } as const;
  const day = cfg.days[weekdayKeys[wd as 1 | 2 | 3 | 4]];
  return { status: 'open', time: day.time, type: day.type };
}
