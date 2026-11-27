import { describe, expect, it } from 'vitest';

import {
  checkinKey,
  MAX_DAYS,
  recentDays,
  visibleDayCount,
  withCheckin,
} from '@/features/habits/habitDays';

describe('recentDays', () => {
  it('ends on today, oldest first, with Dutch weekdays', () => {
    const days = recentDays('2026-11-27', 3);
    expect(days.map((day) => day.key)).toEqual(['2026-11-25', '2026-11-26', '2026-11-27']);
    expect(days.map((day) => day.weekday)).toEqual(['wo', 'do', 'vr']);
    expect(days.map((day) => day.isToday)).toEqual([false, false, true]);
  });

  it('crosses a month boundary', () => {
    const days = recentDays('2026-12-01', 3);
    expect(days.map((day) => day.key)).toEqual(['2026-11-29', '2026-11-30', '2026-12-01']);
    expect(days.map((day) => day.dayOfMonth)).toEqual(['29', '30', '1']);
  });
});

describe('visibleDayCount', () => {
  it('fits columns next to the name and stays within bounds', () => {
    expect(visibleDayCount(360)).toBe(4);
    expect(visibleDayCount(412)).toBe(5);
    expect(visibleDayCount(1000)).toBe(MAX_DAYS);
    expect(visibleDayCount(300)).toBe(3);
  });
});

describe('withCheckin', () => {
  it('adds and removes without mutating the original', () => {
    const key = checkinKey('habit', '2026-11-27');
    const original = new Set<string>();
    const added = withCheckin(original, key, true);
    expect(added.has(key)).toBe(true);
    expect(original.size).toBe(0);
    expect(withCheckin(added, key, false).has(key)).toBe(false);
  });
});
