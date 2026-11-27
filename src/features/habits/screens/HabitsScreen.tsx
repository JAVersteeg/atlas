import { CircleCheckBig } from 'lucide-react-native';
import { useMemo } from 'react';
import { ActivityIndicator, useWindowDimensions } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { Screen } from '@/components/Screen';
import { SectionCard } from '@/components/SectionCard';
import { Caption } from '@/components/Typography';
import { AddHabitRow } from '@/features/habits/components/AddHabitRow';
import { HabitDaysHeader } from '@/features/habits/components/HabitDaysHeader';
import { HabitRow } from '@/features/habits/components/HabitRow';
import { recentDays, visibleDayCount } from '@/features/habits/habitDays';
import { useHabits } from '@/features/habits/hooks/useHabits';
import { useToday } from '@/features/habits/hooks/useToday';
import { palette } from '@/theme/palette';

export function HabitsScreen() {
  const today = useToday();
  const { width } = useWindowDimensions();
  const days = useMemo(() => recentDays(today, visibleDayCount(width)), [today, width]);
  const { habits, checked, isLoading, error, toggle, addHabit, archiveHabit } = useHabits(today);

  return (
    <Screen title="Gewoontes">
      {error ? <Caption className="text-danger-softFg">{error}</Caption> : null}
      {isLoading ? (
        <ActivityIndicator color={palette.accent.DEFAULT} className="py-10" />
      ) : habits.length === 0 ? (
        <EmptyState
          icon={CircleCheckBig}
          title="Nog geen gewoontes"
          body="Voeg hieronder je eerste gewoonte toe."
        />
      ) : (
        <SectionCard padding="px-4 py-0">
          <HabitDaysHeader days={days} />
          {habits.map((habit) => (
            <HabitRow
              key={habit.id}
              habit={habit}
              days={days}
              checked={checked}
              onToggle={toggle}
              onArchive={archiveHabit}
            />
          ))}
        </SectionCard>
      )}
      <AddHabitRow onAdd={addHabit} />
    </Screen>
  );
}
