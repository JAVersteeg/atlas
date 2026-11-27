import { describe, expect, it } from 'vitest';

import { fromDayKey, toDayKey } from '@/lib/days';

describe('day keys', () => {
  it('formats a local date as yyyy-MM-dd', () => {
    expect(toDayKey(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05');
  });

  it('round-trips through local midnight', () => {
    const date = fromDayKey('2026-03-29'); // the night the clocks go forward in Amsterdam
    expect(date.getHours()).toBe(0);
    expect(toDayKey(date)).toBe('2026-03-29');
  });

  it('rejects anything that is not a day key', () => {
    expect(() => fromDayKey('2026-3-29')).toThrow();
  });
});
