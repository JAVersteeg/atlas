import { Check, X } from 'lucide-react-native';
import { Pressable } from 'react-native';

import { HABIT_CELL_WIDTH } from '@/features/habits/habitDays';
import { palette } from '@/theme/palette';

interface HabitDayCellProps {
  label: string;
  checked: boolean;
  isToday: boolean;
  onPress: () => void;
}

/** One habit on one day: a gold check when done, a faint cross when not. Tap to toggle. */
export function HabitDayCell({ label, checked, isToday, onPress }: HabitDayCellProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked }}
      onPress={onPress}
      className={`h-14 items-center justify-center ${isToday ? 'bg-surface-raised' : ''}`}
      style={{ width: HABIT_CELL_WIDTH }}
    >
      {checked ? (
        <Check size={22} color={palette.accent.DEFAULT} strokeWidth={3} />
      ) : (
        <X size={16} color={palette.ink.faint} strokeWidth={2} />
      )}
    </Pressable>
  );
}
