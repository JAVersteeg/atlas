import { addDays, format } from 'date-fns';
import { nl } from 'date-fns/locale';

import { fromDayKey, toDayKey } from '@/lib/days';

export const HABIT_CELL_WIDTH = 44;
const NAME_MIN_WIDTH = 120;
/** Screen padding plus card padding, both sides. */
const HORIZONTAL_CHROME = 64;
const MIN_DAYS = 3;
export const MAX_DAYS = 7;

export interface HabitDay {
  key: string;
  /** Two-letter Dutch weekday: ma, di, wo... */
  weekday: string;
  dayOfMonth: string;
  isToday: boolean;
}

/** How many day columns fit next to the habit name on a screen this wide. */
export function visibleDayCount(width: number): number {
  const fit = Math.floor((width - HORIZONTAL_CHROME - NAME_MIN_WIDTH) / HABIT_CELL_WIDTH);
  return Math.min(MAX_DAYS, Math.max(MIN_DAYS, fit));
}

/** The last `count` days ending at `today`, oldest first, so today is the right-most column. */
export function recentDays(today: string, count: number): HabitDay[] {
  const end = fromDayKey(today);
  return Array.from({ length: count }, (_, index) => {
    const date = addDays(end, index - (count - 1));
    const key = toDayKey(date);
    return {
      key,
      weekday: format(date, 'EEEEEE', { locale: nl }),
      dayOfMonth: format(date, 'd'),
      isToday: key === today,
    };
  });
}

export function checkinKey(habitId: string, day: string): string {
  return `${habitId}|${day}`;
}

/** A copy of `keys` with `key` present or absent. */
export function withCheckin(keys: ReadonlySet<string>, key: string, on: boolean): Set<string> {
  const next = new Set(keys);
  if (on) next.add(key);
  else next.delete(key);
  return next;
}
