import { Alert, Pressable, View } from 'react-native';

import { Text } from '@/components/Text';
import { HabitDayCell } from '@/features/habits/components/HabitDayCell';
import { checkinKey, type HabitDay } from '@/features/habits/habitDays';
import type { Habit } from '@/features/habits/hooks/useHabits';

interface HabitRowProps {
  habit: Habit;
  days: HabitDay[];
  checked: ReadonlySet<string>;
  onToggle: (habitId: string, day: string) => void;
  onArchive: (habitId: string) => void;
}

/** A habit's name and its recent days. Long-press the name to archive. */
export function HabitRow({ habit, days, checked, onToggle, onArchive }: HabitRowProps) {
  function confirmArchive() {
    Alert.alert('Gewoonte archiveren?', habit.name, [
      { text: 'Annuleren', style: 'cancel' },
      { text: 'Archiveren', style: 'destructive', onPress: () => onArchive(habit.id) },
    ]);
  }

  return (
    <View className="flex-row items-center border-b border-line">
      <Pressable className="flex-1 py-3 pr-2" onLongPress={confirmArchive}>
        <Text className="text-base" numberOfLines={2}>
          {habit.name}
        </Text>
      </Pressable>
      {days.map((day) => (
        <HabitDayCell
          key={day.key}
          label={`${habit.name}, ${day.weekday} ${day.dayOfMonth}`}
          checked={checked.has(checkinKey(habit.id, day.key))}
          isToday={day.isToday}
          onPress={() => onToggle(habit.id, day.key)}
        />
      ))}
    </View>
  );
}
