import { describe, expect, it } from 'vitest';
import {
  getBannerState,
  getFridayLabel,
  getSaturdayTheme,
  getVancouverDateStr,
  isMoonRestDay,
  nextWeekdayDate,
  weekdayIndex,
  weekdayName,
  type ScheduleConfig,
} from './schedule';

const cfg: ScheduleConfig = {
  days: {
    monday: { time: '6:00 - 8:15 am', type: 'Open practice (no teacher guidance)' },
    tuesday: { time: '5:45 - 8:15 am', type: 'Teacher-supported independent practice' },
    wednesday: { time: '5:45 - 8:15 am', type: 'Open practice (no guidance)' },
    thursday: { time: '5:45 - 8:15 am', type: 'Open practice (no teacher guidance)' },
    friday: { time: '6:00 - 8:15 am', type: 'Guided Practice / Asana Skill Development' },
  },
  fridayAlternates: ['Guided Practice', 'Asana Skill Development'],
  fridayAnchor: { date: '2026-07-03', label: 'Guided Practice' },
  saturdayThemes: [{ date: '2026-07-11', theme: 'Bhagavad Gita focused practice' }],
  moonRestDays: ['2026-07-14', '2026-07-29'],
};

describe('weekday helpers', () => {
  it('identifies the correct weekday index', () => {
    expect(weekdayIndex('2026-07-03')).toBe(5); // Friday
    expect(weekdayIndex('2026-07-05')).toBe(0); // Sunday
    expect(weekdayIndex('2026-07-06')).toBe(1); // Monday
  });

  it('returns the weekday name', () => {
    expect(weekdayName('2026-07-03')).toBe('Friday');
    expect(weekdayName('2026-07-11')).toBe('Saturday');
  });
});

describe('nextWeekdayDate', () => {
  it('returns the same date when the weekday matches', () => {
    // 2026-07-13 is a Monday.
    expect(nextWeekdayDate('2026-07-13', 1)).toBe('2026-07-13');
  });

  it('finds the upcoming weekday within the current week', () => {
    // From Monday 2026-07-13, the coming Tuesday is 2026-07-14.
    expect(nextWeekdayDate('2026-07-13', 2)).toBe('2026-07-14');
    // ...and the coming Friday is 2026-07-17.
    expect(nextWeekdayDate('2026-07-13', 5)).toBe('2026-07-17');
  });

  it('wraps into next week for weekdays already passed', () => {
    // From Wednesday 2026-07-15, the next Tuesday is 2026-07-21.
    expect(nextWeekdayDate('2026-07-15', 2)).toBe('2026-07-21');
  });
});

describe('getFridayLabel', () => {
  it('returns the anchor label on the anchor date', () => {
    expect(getFridayLabel('2026-07-03', cfg)).toBe('Guided Practice');
  });

  it('alternates on subsequent Fridays', () => {
    expect(getFridayLabel('2026-07-10', cfg)).toBe('Asana Skill Development');
    expect(getFridayLabel('2026-07-17', cfg)).toBe('Guided Practice');
    expect(getFridayLabel('2026-07-24', cfg)).toBe('Asana Skill Development');
  });

  it('alternates correctly before the anchor date', () => {
    expect(getFridayLabel('2026-06-26', cfg)).toBe('Asana Skill Development');
    expect(getFridayLabel('2026-06-19', cfg)).toBe('Guided Practice');
  });
});

describe('getSaturdayTheme', () => {
  it('finds a matching theme', () => {
    expect(getSaturdayTheme('2026-07-11', cfg)).toBe('Bhagavad Gita focused practice');
  });

  it('returns null when no theme is set', () => {
    expect(getSaturdayTheme('2026-07-18', cfg)).toBeNull();
  });
});

describe('isMoonRestDay', () => {
  it('detects moon rest days', () => {
    expect(isMoonRestDay('2026-07-14', cfg)).toBe(true);
    expect(isMoonRestDay('2026-07-15', cfg)).toBe(false);
  });
});

describe('getBannerState', () => {
  it('prioritises moon rest days over the weekday schedule', () => {
    // 2026-07-14 is a Tuesday but also a moon rest day.
    expect(getBannerState('2026-07-14', cfg)).toEqual({ status: 'moon' });
  });

  it('reports Sundays as closed', () => {
    expect(getBannerState('2026-07-05', cfg)).toEqual({ status: 'closed' });
  });

  it('reports themed and non-themed Saturdays', () => {
    expect(getBannerState('2026-07-11', cfg)).toEqual({
      status: 'saturday',
      theme: 'Bhagavad Gita focused practice',
    });
    expect(getBannerState('2026-07-18', cfg)).toEqual({ status: 'closed' });
  });

  it('reports the Friday alternation with time', () => {
    expect(getBannerState('2026-07-03', cfg)).toEqual({
      status: 'open',
      time: '6:00 - 8:15 am',
      type: 'Guided Practice',
    });
  });

  it('reports a regular weekday session', () => {
    expect(getBannerState('2026-07-06', cfg)).toEqual({
      status: 'open',
      time: '6:00 - 8:15 am',
      type: 'Open practice (no teacher guidance)',
    });
    expect(getBannerState('2026-07-07', cfg)).toEqual({
      status: 'open',
      time: '5:45 - 8:15 am',
      type: 'Teacher-supported independent practice',
    });
  });
});

describe('getVancouverDateStr', () => {
  it('converts a UTC instant to the Vancouver calendar date', () => {
    // 06:00 UTC on Jul 3 is still Jul 2 in Vancouver (PDT, UTC-7).
    expect(getVancouverDateStr(new Date('2026-07-03T06:00:00Z'))).toBe('2026-07-02');
    // 07:30 UTC crosses into Jul 3 locally.
    expect(getVancouverDateStr(new Date('2026-07-03T07:30:00Z'))).toBe('2026-07-03');
  });
});
