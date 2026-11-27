import { addDays } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';

import { checkinKey, MAX_DAYS, withCheckin } from '@/features/habits/habitDays';
import { fromDayKey, toDayKey } from '@/lib/days';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

export type Habit = Database['public']['Tables']['habits']['Row'];

const LOAD_ERROR = 'Gewoontes laden mislukt. Controleer je verbinding.';
const SAVE_ERROR = 'Opslaan mislukt. Probeer het opnieuw.';

/** Habits plus the check-ins of the days on screen; toggling is optimistic and rolls back. */
export function useHabits(today: string) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [checked, setChecked] = useState<ReadonlySet<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const since = toDayKey(addDays(fromDayKey(today), 1 - MAX_DAYS));
      const [habitsResult, checkinsResult] = await Promise.all([
        supabase
          .from('habits')
          .select('*')
          .is('archived_at', null)
          .order('position')
          .order('created_at'),
        supabase.from('habit_checkins').select('habit_id, day').gte('day', since),
      ]);
      const { data: habitRows, error: habitsError } = habitsResult;
      const { data: checkinRows, error: checkinsError } = checkinsResult;
      if (cancelled) return;

      if (habitsError || checkinsError) {
        setError(LOAD_ERROR);
      } else {
        setHabits(habitRows);
        setChecked(new Set(checkinRows.map((row) => checkinKey(row.habit_id, row.day))));
        setError(null);
      }
      setIsLoading(false);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [today]);

  const toggle = useCallback(
    async (habitId: string, day: string) => {
      const key = checkinKey(habitId, day);
      const wasChecked = checked.has(key);
      setChecked((previous) => withCheckin(previous, key, !wasChecked));
      setError(null);

      const { error: writeError } = wasChecked
        ? await supabase.from('habit_checkins').delete().eq('habit_id', habitId).eq('day', day)
        : await supabase
            .from('habit_checkins')
            .upsert({ habit_id: habitId, day }, { onConflict: 'habit_id,day' });

      if (writeError) {
        setChecked((previous) => withCheckin(previous, key, wasChecked));
        setError(SAVE_ERROR);
      }
    },
    [checked],
  );

  /** Resolves to true once the habit is stored. */
  const addHabit = useCallback(
    async (name: string): Promise<boolean> => {
      const trimmed = name.trim();
      if (!trimmed) return false;
      const position = habits.reduce((max, habit) => Math.max(max, habit.position), -1) + 1;

      const { data, error: insertError } = await supabase
        .from('habits')
        .insert({ name: trimmed, position })
        .select()
        .single();

      if (insertError) {
        setError(SAVE_ERROR);
        return false;
      }
      setHabits((previous) => [...previous, data]);
      setError(null);
      return true;
    },
    [habits],
  );

  const archiveHabit = useCallback(async (habitId: string) => {
    const { error: updateError } = await supabase
      .from('habits')
      .update({ archived_at: new Date().toISOString() })
      .eq('id', habitId);

    if (updateError) {
      setError(SAVE_ERROR);
      return;
    }
    setHabits((previous) => previous.filter((habit) => habit.id !== habitId));
    setError(null);
  }, []);

  return { habits, checked, isLoading, error, toggle, addHabit, archiveHabit };
}
