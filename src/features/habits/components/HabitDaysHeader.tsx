import { View } from 'react-native';

import { Text } from '@/components/Text';
import { Metric } from '@/components/Typography';
import { HABIT_CELL_WIDTH, type HabitDay } from '@/features/habits/habitDays';

interface HabitDaysHeaderProps {
  days: HabitDay[];
}

/** The weekday and date above each column; today is gold. */
export function HabitDaysHeader({ days }: HabitDaysHeaderProps) {
  return (
    <View className="flex-row border-b border-line">
      <View className="flex-1" />
      {days.map((day) => (
        <View
          key={day.key}
          className={`items-center py-2 ${day.isToday ? 'bg-surface-raised' : ''}`}
          style={{ width: HABIT_CELL_WIDTH }}
        >
          <Text className={`text-xs ${day.isToday ? 'text-accent' : 'text-ink-subtle'}`}>
            {day.weekday}
          </Text>
          <Metric
            className={`text-base font-bold ${day.isToday ? 'text-accent' : 'text-ink-muted'}`}
          >
            {day.dayOfMonth}
          </Metric>
        </View>
      ))}
    </View>
  );
}
