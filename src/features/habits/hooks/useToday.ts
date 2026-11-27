import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { toDayKey } from '@/lib/days';

/** Today's day key, refreshed when the app returns to the foreground (it may be past midnight). */
export function useToday(): string {
  const [today, setToday] = useState(() => toDayKey(new Date()));

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') setToday(toDayKey(new Date()));
    });
    return () => subscription.remove();
  }, []);

  return today;
}
