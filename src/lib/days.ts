import { format } from 'date-fns';

/**
 * A calendar day as `yyyy-MM-dd`, in the device's time zone. Days are compared and stored as these
 * strings, never as timestamps, so a day never slips across a time-zone boundary.
 */
export function toDayKey(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/** The `Date` at local midnight of a `yyyy-MM-dd` day key. */
export function fromDayKey(day: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(day);
  if (!match) throw new Error(`Not a day key: ${day}`);
  const [, year, month, date] = match;
  return new Date(Number(year), Number(month) - 1, Number(date));
}
